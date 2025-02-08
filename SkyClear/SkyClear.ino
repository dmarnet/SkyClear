#include <PID_v1_bc.h>  // Biblioteca PID

/*************************************************************
 * SkyClear System - Firmware em C/Arduino
 * Simulação de Controle de Motor Híbrido (Motor Combustão + Elétrico)
 * + Emulação de Energia Solar Fotovoltaica + Controle PID
 *
 * Possui controle físico (botões) + controle via Serial,
 * com prioridade do botão físico.
 *
 * Componentes usados para simulação:
 * - LDRs para simular luz solar
 * - Botões para acionar motores / modos
 * - LEDs para indicar status
 * - Comunicação Serial para interface com painel web
 *
 * Versão: 1.0
 * Autor: Daniel Elbachá Marnet
 * 29/01/2025
 *************************************************************/

// Definição dos pinos
#define LDR_PIN1 A0       // LDR1 para intensidade solar
#define LDR_PIN2 A1       // LDR2 para intensidade solar

#define BTN_COMBUSTAO 5
#define BTN_ELETRICO 6
#define BTN_PID 7

#define LED_COMBUSTAO 8
#define LED_ELETRICO 9
#define LED_SOLAR 10
#define LED_PID 11

// Variáveis de estado
bool motorCombustaoAtivo = true;  
bool motorEletricoAtivo = true;   
bool cargaBateriaAtivada = true;
bool geracaoSolarAtiva = false;

// O controle PID inicia ligado (AUTOMATIC). Caso false => MANUAL.
bool controlePID = true;

// Níveis de combustível e bateria (0-100)
float combustivelAtual = 100.0;    
float bateriaAtual = 100.0;        

// Intensidade solar (0-100%)
float solarIntensity = 0.0;
float solarIntensityRef = 5.0;  // ponto de corte para "tem ou não tem sol"
float cargaGeradaSolar = 0.0;   

// Taxas
float consumoPorSegundo = 1.00;        
float cargaSolarPorSegundo = 0.50;     
float cargaCombustaoPorSegundo = 0.10; 
float consumoEletrico = 1.00;          
float combustivelCargaBateria = 0.10;  

// Emissões de CO2
float taxaCO2Combustao = 2.5;  
float taxaCO2Eletrico = 0.0;   

// Emissão de CO2 atual e total
float emissaoCO2Atual = 0.0;
float emissaoCO2Total = 0.0;

// Cálculo de CO2 não emitido
float co2NaoEmitidoEletricoAtual = 0.0;
float co2NaoEmitidoEletricoTotal = 0.0;
float co2NaoEmitidoSolarAtual = 0.0;
float co2NaoEmitidoSolarTotal = 0.0;

// Potências iniciais (0-100%)
int potenciaCombustao = 50;
int potenciaEletrico = 50;

// Variáveis de tempo
unsigned long lastUpdateTime = 0;

// =============================================================
//  Configurações do PID
// =============================================================
double co2Input = 0.0;     // Valor medido de emissão de CO₂
double co2Output = 100.0;   // Saída do PID (0 a 100) = % motor elétrico
double co2Setpoint = 0.0;  // Queremos emissões próximas de 0

double Kp = 2.0;  
double Ki = 1.0;  
double Kd = 0.5;  

PID co2PID(&co2Input, &co2Output, &co2Setpoint, Kp, Ki, Kd, REVERSE);

// ======================================================================
//  Função para atualizar potências no modo MANUAL
// ======================================================================
void ajustarPotenciasManual() {
  // Ajuste simples:
  if (motorCombustaoAtivo && motorEletricoAtivo && combustivelAtual > 0 && bateriaAtual > 0) {
    potenciaCombustao = 50;
    potenciaEletrico  = 50;
  }
  else if (motorCombustaoAtivo && !motorEletricoAtivo && combustivelAtual > 0) {
    potenciaCombustao = 100;
    potenciaEletrico  = 0;
  }
  else if (!motorCombustaoAtivo && motorEletricoAtivo && bateriaAtual > 0) {
    potenciaCombustao = 0;
    potenciaEletrico  = 100;
  }
  else {
    // Se ambos desligados ou sem recursos
    if (combustivelAtual <= 0 && bateriaAtual > 0) {
      potenciaCombustao = 0;
      potenciaEletrico  = 100;
    } else if (bateriaAtual <= 0 && combustivelAtual > 0) {
      potenciaCombustao = 100;
      potenciaEletrico  = 0;
    } else {
      potenciaCombustao = 0;
      potenciaEletrico  = 0;
    }
  }
}

// ======================================================================
//  Função para ler comandos vindos via Serial
// ======================================================================
void lerComandosSerial() {
  // Ex: "TOGGLE:COMBUSTAO", "TOGGLE:ELETRICO", "TOGGLE:PID"
  if (Serial.available() > 0) {
    String comando = Serial.readStringUntil('\n');
    comando.trim();

    if (comando == "TOGGLE:COMBUSTAO") {
      if (!controlePID) { // Modo MANUAL
        motorCombustaoAtivo = !motorCombustaoAtivo;
        ajustarPotenciasManual();
        Serial.println("{\"info\":\"Combustion toggled via Web.\",\"mode\":\"manual\"}");
      } else {
        Serial.println("{\"info\":\"Combustion toggle via Web ignored due to active PID Control.\",\"mode\":\"PID automatic\"}");
      }
    }
    else if (comando == "TOGGLE:ELETRICO") {
      if (!controlePID) {
        motorEletricoAtivo = !motorEletricoAtivo;
        ajustarPotenciasManual();
        Serial.println("{\"info\":\"Eletric toggled via Web.\",\"mode\":\"manual\"}");
      } else {
        Serial.println("{\"info\":\"Eletric toggle via Web ignored due to active PID Control.\",\"mode\":\"PID automatic\"}");
      }
    }
    else if (comando == "TOGGLE:PID") {
      // Liga/desliga o PID
      controlePID = !controlePID;
      if (!controlePID) {
        co2PID.SetMode(MANUAL);
        ajustarPotenciasManual();
        Serial.println("{\"info\":\"Manual control activated via Web.\",\"controlPID\":false}");
      } else {
        co2PID.SetMode(AUTOMATIC);
        Serial.println("{\"info\":\"PID automatic control activated via Web.\",\"controlPID\":true}");
      }
    }
  }
}

void setup() {
  Serial.begin(9600);

  pinMode(LDR_PIN1, INPUT);
  pinMode(LDR_PIN2, INPUT);

  pinMode(BTN_COMBUSTAO, INPUT_PULLUP);
  pinMode(BTN_ELETRICO, INPUT_PULLUP);
  pinMode(BTN_PID, INPUT_PULLUP);

  pinMode(LED_COMBUSTAO, OUTPUT);
  pinMode(LED_ELETRICO, OUTPUT);
  pinMode(LED_SOLAR, OUTPUT);
  pinMode(LED_PID, OUTPUT);

  co2PID.SetOutputLimits(0, 100);
  co2PID.SetMode(AUTOMATIC);

  Serial.println("{\"info\":\"SkyClear System Initialized\"}");

  lastUpdateTime = millis();
}

void loop() {
  // 1. Ler comandos vindos da Serial
  lerComandosSerial();

  // 2. Ler botões físicos (prioritário)
  if (!digitalRead(BTN_COMBUSTAO)) {
    if (!controlePID) {
      motorCombustaoAtivo = !motorCombustaoAtivo;
      ajustarPotenciasManual();
      Serial.println("{\"info\":\"Combustion button pressed on Arduino.\",\"mode\":\"manual\"}");
    } else {
      Serial.println("{\"info\":\"Combustion press on Arduino ignored due to active PID Control.\",\"mode\":\"PID automatic\"}");
    }
    delay(200); // debounce
  }

  if (!digitalRead(BTN_ELETRICO)) {
    if (!controlePID) {
      motorEletricoAtivo = !motorEletricoAtivo;
      ajustarPotenciasManual();
      Serial.println("{\"info\":\"Electric button pressed on Arduino.\",\"mode\":\"manual\"}");
    } else {
      Serial.println("{\"info\":\"Electric press on Arduino ignored due to active PID Control.\",\"mode\":\"PID automatic\"}");
    }
    delay(200); // debounce
  }

  // Botão PID
  if (!digitalRead(BTN_PID)) {
    controlePID = !controlePID;
    if (!controlePID) {
      co2PID.SetMode(MANUAL);
      ajustarPotenciasManual();
      Serial.println("{\"info\":\"Manual control activated on Arduino.\",\"controlPID\":false}");
    } else {
      co2PID.SetMode(AUTOMATIC);
      Serial.println("{\"info\":\"PID automatic control activated on Arduino.\",\"controlPID\":true}");
    }
    delay(200); // debounce
  }

  // 3. Ler LDRs para intensidade solar
  int ldrValue1 = analogRead(LDR_PIN1);
  int ldrValue2 = analogRead(LDR_PIN2);
  solarIntensity = map(ldrValue1 + ldrValue2, 0, 2046, 0, 100);
  geracaoSolarAtiva = (solarIntensity > solarIntensityRef);

  // 4. Atualizar física do sistema ~1 vez/segundo
  unsigned long currentTime = millis();
  float deltaTime = (currentTime - lastUpdateTime) / 1000.0;
  if (deltaTime >= 1.0) {
    lastUpdateTime = currentTime;

    // 4.1 Carregamento via Solar
    cargaGeradaSolar = 0.0;
    if (geracaoSolarAtiva) {
      cargaGeradaSolar = cargaSolarPorSegundo * (solarIntensity / 100.0) * deltaTime;
      bateriaAtual += cargaGeradaSolar;
    }

    // 4.2 Carregamento via motor de combustão (se ligado e houver combustível)
    if (cargaBateriaAtivada && motorCombustaoAtivo && combustivelAtual > 0 && bateriaAtual < 100) {
      bateriaAtual += cargaCombustaoPorSegundo * deltaTime;
      combustivelCargaBateria = cargaCombustaoPorSegundo * 0.5;
    } else {
      combustivelCargaBateria = 0.0;
    }

    // 4.3 Consumo de combustível
    if (potenciaCombustao > 0 && combustivelAtual > 0) {
      float combustivelGasto = (consumoPorSegundo * (potenciaCombustao / 100.0) * deltaTime) 
                               + combustivelCargaBateria;
      combustivelAtual -= combustivelGasto;
      if (combustivelAtual < 0) combustivelAtual = 0;
    }

    // 4.4 Consumo de bateria
    if (potenciaEletrico > 0 && bateriaAtual > 0) {
      float bateriaGasta = consumoEletrico * (potenciaEletrico / 100.0) * deltaTime;
      bateriaAtual -= bateriaGasta;
      if (bateriaAtual < 0) bateriaAtual = 0;
    }

    // Limitar a 0..100
    bateriaAtual = constrain(bateriaAtual, 0, 100);
    combustivelAtual = constrain(combustivelAtual, 0, 100);

    // 4.5 Cálculo de emissões CO2
    float emissaoCO2Combustao = (potenciaCombustao / 100.0) * taxaCO2Combustao; 
    float emissaoCO2Eletrico  = (potenciaEletrico  / 100.0) * taxaCO2Eletrico;
    emissaoCO2Atual = emissaoCO2Combustao + emissaoCO2Eletrico;    
    emissaoCO2Total += emissaoCO2Atual * deltaTime;                 

    // 4.6 CO2 não emitido (elétrico + solar)
    co2NaoEmitidoEletricoAtual = (taxaCO2Combustao * (potenciaEletrico / 100.0)) * deltaTime;
    co2NaoEmitidoEletricoTotal += co2NaoEmitidoEletricoAtual;

    if (cargaGeradaSolar > 0) {
      co2NaoEmitidoSolarAtual = cargaGeradaSolar * (taxaCO2Combustao / cargaCombustaoPorSegundo);
      co2NaoEmitidoSolarTotal += co2NaoEmitidoSolarAtual;
    } else {
      co2NaoEmitidoSolarAtual = 0;
    }

    // 4.7 PID em modo automático
    if (co2PID.GetMode() == AUTOMATIC) {
      co2Input    = emissaoCO2Atual;
      co2Setpoint = 0.0;
      co2PID.Compute();  // atualiza co2Output

      if (combustivelAtual <= 0) {
        // sem combustível => força elétrico
        potenciaCombustao = 0;
        potenciaEletrico  = (bateriaAtual > 0) ? 100 : 0;       
      } 
      else if (bateriaAtual <= 0) {
        // sem bateria => força combustão
        potenciaCombustao = 100;
        potenciaEletrico  = 0;
      } 
      else {
        // ajuste normal
        potenciaEletrico  = (int)co2Output;
        potenciaCombustao = 100 - potenciaEletrico;
      }
      // Se a potência for maior que 0, motor deve estar ligado
      //motorCombustaoAtivo = (potenciaCombustao > 0);
      //motorEletricoAtivo  = (potenciaEletrico  > 0);
      
      // ============== Recarrega se acabar o recurso ==============
      // 1) Combustível acabou e motorCombustaoAtivo == true
      if (combustivelAtual <= 0) {
        combustivelAtual = 100.0;
        Serial.println("{\"info\":\"Fuel refilled automatically.\"}");
      }
      // 2) Bateria acabou (~<= 1) e motorEletricoAtivo == true
      if (bateriaAtual <= 0) {
        bateriaAtual = 100.0;
        Serial.println("{\"info\":\"Battery recharged automatically.\"}");
      }
    }
    else {
      // 4.8 MODO MANUAL
      ajustarPotenciasManual();

      // ============== Recarrega se acabar o recurso ==============
      // 1) Combustível acabou e motorCombustaoAtivo == true
      if (combustivelAtual <= 0) {
        combustivelAtual = 100.0;
        Serial.println("{\"info\":\"Fuel refilled automatically.\"}");
      }
      // 2) Bateria acabou (~<= 1) e motorEletricoAtivo == true
      if (bateriaAtual <= 0) {
        bateriaAtual = 100.0;
        Serial.println("{\"info\":\"Battery recharged automatically.\"}");
      }
    }
  }

  // 5. Atualizar LEDs
  digitalWrite(LED_COMBUSTAO, potenciaCombustao > 0 ? HIGH : LOW);
  digitalWrite(LED_ELETRICO,  potenciaEletrico  > 0 ? HIGH : LOW);
  digitalWrite(LED_SOLAR,     geracaoSolarAtiva ? HIGH : LOW);
  digitalWrite(LED_PID,       controlePID ? HIGH : LOW);

  // 6. Enviar dados via Serial em JSON
  Serial.print("{\"PIDcontrol\":\"");
  Serial.print(controlePID ? "On" : "Off");
  Serial.print("\",\"combustion\":\"");
  Serial.print(potenciaCombustao > 0 ? "On" : "Off");
  Serial.print("\",\"powerCombustion\":");
  Serial.print(potenciaCombustao);
  Serial.print(",\"fuel\":");
  Serial.print(combustivelAtual, 2);
  Serial.print(",\"electric\":\"");
  Serial.print(potenciaEletrico > 0 ? "On" : "Off");
  Serial.print("\",\"powerElectric\":");
  Serial.print(potenciaEletrico);
  Serial.print(",\"batteryLevel\":");
  Serial.print(bateriaAtual, 2);
  Serial.print(",\"solar\":\"");
  Serial.print(geracaoSolarAtiva ? "On" : "Off");
  Serial.print("\",\"solarCharge\":");
  Serial.print(cargaGeradaSolar, 2);
  Serial.print(",\"currentCO2\":");
  Serial.print(emissaoCO2Atual, 2);
  Serial.print(",\"totalCO2\":");
  Serial.print(emissaoCO2Total, 2);
  Serial.print(",\"CO2NotEmittedCurrentElectric\":");
  Serial.print(co2NaoEmitidoEletricoAtual, 2);
  Serial.print(",\"CO2NotEmittedTotalElectric\":");
  Serial.print(co2NaoEmitidoEletricoTotal, 2);
  Serial.print(",\"CO2NotEmittedCurrentSolar\":");
  Serial.print(co2NaoEmitidoSolarAtual, 2);
  Serial.print(",\"CO2NotEmittedTotalSolar\":");
  Serial.print(co2NaoEmitidoSolarTotal, 2);
  Serial.println("}");

  delay(100);
}
