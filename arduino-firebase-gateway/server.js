import express from 'express';
import cors from 'cors';

// Import do serialport
import { SerialPort, ReadlineParser } from 'serialport';

// Import do Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// -----------------------------------------------------------------
// Configuração do Firebase
// -----------------------------------------------------------------
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Inicializa Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// -----------------------------------------------------------------
// Configuração da Porta Serial (Arduino)
// -----------------------------------------------------------------
// Ajuste 'path' conforme seu sistema (Windows: COM9, COM3 etc. / Linux/Mac: /dev/ttyUSB0)
const arduinoPort = new SerialPort({
  path: 'COM9',
  baudRate: 9600
});

// Parser para dividir dados por linha
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));

arduinoPort.on('open', () => {
  console.log('Porta Serial aberta em COM9');
});

arduinoPort.on('error', (err) => {
  console.error('Erro na porta Serial:', err.message);
});

// -----------------------------------------------------------------
// Variável para armazenar o último JSON recebido do Arduino
// -----------------------------------------------------------------
let lastArduinoData = {};

// -----------------------------------------------------------------
// Leitura dos dados enviados pelo Arduino
// -----------------------------------------------------------------
parser.on('data', (line) => {
  try {
    // Tentar converter a linha em JSON
    const jsonData = JSON.parse(line.trim());
    console.log('Recebido da Serial:', jsonData);

    // Armazenar localmente
    lastArduinoData = jsonData;

    // Enviar os dados para o Firebase
    set(ref(db, 'arduinoData'), jsonData)
      .then(() => console.log('Dados enviados para o Firebase'))
      .catch((error) => console.error('Erro ao enviar para o Firebase:', error));

  } catch (error) {
    // Se não for JSON válido, apenas mostra o erro
    console.error('Erro ao converter para JSON:', error.message);
  }
});

// -----------------------------------------------------------------
// Criação do Servidor Express
// -----------------------------------------------------------------
//const express = require("express");
//const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------
// Rotas para "toggle" - Combustão, Elétrico, PID
// (Ex: POST /toggle/combustao )
// -----------------------------------------------------------------
app.post('/toggle/:type', (req, res) => {
  const type = req.params.type.toUpperCase(); // COMBUSTAO | ELETRICO | PID
  // Monta o comando no padrão do Arduino => "TOGGLE:COMBUSTAO"
  const command = `TOGGLE:${type}`;

  arduinoPort.write(command + "\n", (err) => {
    if (err) {
      console.error('Erro ao enviar comando Serial:', err);
      return res.status(500).json({ error: 'Erro ao enviar comando Serial' });
    }
    console.log(`Comando enviado ao Arduino: ${command}`);
    res.json({ message: `Enviado comando toggle para ${type}` });
  });
});

// -----------------------------------------------------------------
// Endpoint para retornar o último JSON recebido do Arduino
// -----------------------------------------------------------------
app.get('/arduino-data', (req, res) => {
  res.json(lastArduinoData);
});

app.get("/status", (req, res) => {
  res.status(200).json({ message: "Servidor online!" });
});

// -----------------------------------------------------------------
// Inicia o servidor
// -----------------------------------------------------------------
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor Node rodando na porta ${PORT}`);
});
