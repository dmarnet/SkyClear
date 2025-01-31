// src/components/DocModal.jsx
import React, { useState } from "react";

// Two sets of texts: English (en) and Portuguese (pt).
const docContent = {
  en: {
    title: "SkyClear System Documentation",
    aboutSystemTitle: "About the SkyClear System",
    aboutSystemText1:
      "The SkyClear System is a hybrid control system for aircraft engines, combining a combustion engine and an electric motor, integrated with a photovoltaic solar energy model.",
    aboutSystemText2:
      "Its goal is to simulate, in a simplified manner, how a hybrid powertrain would work under lab conditions, demonstrating reduced emissions and fuel savings.",
    tutorialTitle: "Usage Tutorial",
    tutorialIntro:
      "To interact with the SkyClear System via the web interface, follow these steps:",
    tutorialSteps: [
      "Open the main control panel web page built in React.",
      "In the Control Buttons panel (on the left), you will find three buttons:",
      "The System LEDs section shows the system state (Combustion, Electric, Solar, and PID). When a LED is on (colored), it means it is active/on.",
      "The System Messages section displays informational messages, such as automatic battery or fuel recharge notifications, ignored toggles, etc.",
      "The Fuel and Battery Level Alert section warns you when fuel and battery levels go below 20%.",
      "If you want to switch to manual mode, click on PID On/Off to disable PID, and then the Combustion and Electric buttons become enabled."
    ],
    tutorialSubList: [
      "Combustion On/Off: Toggles the combustion engine (available only in manual mode).",
      "Electric On/Off: Toggles the electric motor (available only in manual mode).",
      "PID On/Off: Switches between manual mode and automatic (PID) mode."
    ],
    tutorialConclusion:
      "That’s it! Now you can control the hybrid system, watching the LEDs, levels, and messages in real-time.",
    projectInfoTitle: "Project Info",
    nameLabel: "Name",
    versionLabel: "Version",
    dateLabel: "Date", 
    lastReleaseLabel: "Last Release",
    authorLabel: "Author",
    contactTitle: "Author Contact",
    emailLabel: "E-mail",
    linkedInLabel: "LinkedIn",
    githubLabel: "GitHub",
    portfolioLabel: "Portfolio",
    physArchTitle: "Physical Components & Architecture",
    physArchText:
      "The system uses an Arduino Uno connected to LDRs (to simulate solar light intensity), status LEDs, and physical buttons for switching between operational modes. Additionally, the Arduino Uno communicates via Serial with a Node.js server, which integrates Firebase and a React web interface for real-time data display and control.",
    physArchList: [
      "Arduino Uno: Runs the firmware with PID logic and energy consumption/production simulation.",
      "Node.js + Express: Local server to receive web commands and relay them to Arduino (via Serial).",
      "Firebase Realtime Database: Stores and syncs system data for the React interface.",
      "React (Web Interface): Dashboard that displays data (LEDs, fuel/battery levels, CO₂ emissions) and allows toggles (Combustion, Electric, PID)."
    ],
    firmwareSummaryTitle: "Firmware Operation Summary",
    firmwareSummaryText:
      "The Arduino code (example provided) contains:",
    firmwareSummaryList: [
      "LDR Sensor Reading: For estimating photovoltaic solar generation.",
      "Physical Buttons: Allow manually turning combustion and electric motors on/off, or toggling PID control.",
      "PID Control: To regulate CO₂ emissions, distributing power between the combustion and electric motors.",
      "Serial JSON Output: In each cycle, Arduino reports fuel, battery, emissions, etc. as JSON.",
      "Automatic Recharge Logic (Manual Mode): If fuel or battery runs out while the respective motor is active, the system automatically refills."
    ],
    requirementsTitle: "Requirements",
    requirementsList: [
      "Hardware: Arduino Uno, LDR sensors, LEDs, buttons, USB cable for communication.",
      "Software: Arduino IDE for firmware upload, Node.js (version 14+), Firebase (configured project), React for the interface.",
      "Connection: The PC running Node.js must be connected to Arduino via USB and have internet access for Firebase."
    ],
    finalRemarksTitle: "Final Remarks",
    finalRemarksText:
      "The SkyClear System is a didactic prototype designed to demonstrate hybrid control concepts, solar generation, and CO₂ monitoring. It can be expanded to IoT scenarios, more advanced modeling, or applied to other research areas.",
    step2sublistTitle:
      "In the Control Buttons panel (on the left), you will find three buttons:",
    closeBtn: "Close",
    langBtnPt: "PT",
    langBtnPtTooltip: "Português",
    langBtnEn: "EN",
    langBtnEnTooltip: "English"
  },

  pt: {
    title: "Documentação do Sistema SkyClear",
    aboutSystemTitle: "Sobre o Sistema SkyClear",
    aboutSystemText1:
      "O Sistema SkyClear é um sistema de controle híbrido para motores de aeronaves, combinando um motor a combustão e um motor elétrico, integrado a um modelo de geração de energia solar fotovoltaica.",
    aboutSystemText2:
      "Seu objetivo é simular, de forma simplificada, o funcionamento de um powertrain híbrido em condições de laboratório, demonstrando redução de emissões e economia de combustível.",
    tutorialTitle: "Tutorial de Uso",
    tutorialIntro:
      "Para interagir com o Sistema SkyClear via a interface web, siga estes passos:",
    tutorialSteps: [
      "Abra a página web principal do painel de controle.",
      "No painel Control Buttons (à esquerda), você encontrará três botões:",
      "A seção System LEDs mostra o estado do sistema (Combustion, Electric, Solar, e PID). Quando um LED estiver aceso (colorido), significa que está ativo/on.",
      "A seção System Messages exibe mensagens informativas, como notificações de recarga automática de bateria ou combustível, toggles ignorados etc.",
      "A seção Fuel and Battery Level Alert alerta quando os níveis de combustível e bateria ficam abaixo de 20%.",
      "Se desejar mudar para modo manual, clique em PID On/Off para desativar o PID, e então os botões Combustion e Electric ficarão habilitados."
    ],
    tutorialSubList: [
      "Combustion On/Off: Ativa ou desativa o motor a combustão (disponível somente em modo manual).",
      "Electric On/Off: Ativa ou desativa o motor elétrico (disponível somente em modo manual).",
      "PID On/Off: Alterna entre modo manual e modo automático (PID)."
    ],
    tutorialConclusion:
      "Pronto! Agora você pode controlar o sistema híbrido, observando os LEDs, níveis e mensagens em tempo real.",
    projectInfoTitle: "Informações do Projeto",
    nameLabel: "Nome",
    versionLabel: "Versão",
    dateLabel: "Data", // Não será exibido
    lastReleaseLabel: "Última Release",
    authorLabel: "Autor",
    contactTitle: "Contato do Autor",
    emailLabel: "E-mail",
    linkedInLabel: "LinkedIn",
    githubLabel: "GitHub",
    portfolioLabel: "Portfólio",
    physArchTitle: "Componentes Físicos e Arquitetura",
    physArchText:
      "O sistema utiliza um Arduino Uno conectado a LDRs (para simular intensidade de luz solar), LEDs de status e botões físicos para alternar entre modos de operação. Além disso, o Arduino Uno se comunica via Serial com um servidor Node.js, que integra Firebase e uma interface web em React, permitindo exibição de dados e controle em tempo real.",
    physArchList: [
      "Arduino Uno: Executa o firmware com lógica PID e simulação de consumo/geração de energia.",
      "Node.js + Express: Servidor local para receber comandos via web e repassar ao Arduino (via Serial).",
      "Firebase Realtime Database: Armazena e sincroniza os dados do sistema para a interface React.",
      "React (Interface Web): Painel que exibe dados (LEDs, níveis de combustível/bateria, emissões de CO₂) e permite toggles (Combustion, Electric, PID)."
    ],
    firmwareSummaryTitle: "Resumo do Funcionamento do Firmware",
    firmwareSummaryText:
      "O código do Arduino (exemplo fornecido) contém:",
    firmwareSummaryList: [
      "Leitura de Sensores (LDRs): Para estimar a geração solar fotovoltaica.",
      "Botões Físicos: Permitem ativar/desativar manualmente o motor a combustão, o motor elétrico ou o controle PID.",
      "Controle PID: Para regular as emissões de CO₂, distribuindo a potência entre o motor a combustão e o motor elétrico.",
      "Envio de JSON via Serial: A cada ciclo, o Arduino reporta dados de combustível, bateria, emissões etc. em JSON.",
      "Lógica de Recarga Automática (Modo Manual): Se o combustível ou bateria acabam enquanto o respectivo motor está ativo, o sistema recarrega automaticamente."
    ],
    requirementsTitle: "Requisitos",
    requirementsList: [
      "Hardware: Arduino Uno, sensores LDR, LEDs, botões, cabo USB para comunicação.",
      "Software: IDE Arduino para upload do firmware, Node.js (versão 14+), Firebase (projeto configurado), React para a interface.",
      "Conexão: O PC que roda o Node.js deve estar conectado ao Arduino via USB e ter acesso à internet para o Firebase."
    ],
    finalRemarksTitle: "Observações Finais",
    finalRemarksText:
      "O Sistema SkyClear é um protótipo didático para demonstrar conceitos de controle híbrido, geração solar e monitoramento de CO₂. Ele pode ser expandido para cenários de IoT, modelagem mais avançada ou aplicado a outras áreas de pesquisa.",
    step2sublistTitle:
      "No painel Control Buttons (à esquerda), você encontrará três botões:",
    closeBtn: "Fechar",
    langBtnPt: "PT",
    langBtnPtTooltip: "Português",
    langBtnEn: "EN",
    langBtnEnTooltip: "English"
  }
};

function DocModal({ show, onClose }) {
  // We store the current language in a local state, default 'en'
  const [lang, setLang] = useState("en");

  if (!show) return null;

  // A helper function to toggle language
  const handleToggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "pt" : "en"));
  };

  // Shorthand to get all the text in the chosen language
  const t = docContent[lang];

  // Decide button label / tooltip based on current language
  const langBtnLabel = lang === "en" ? t.langBtnPt : t.langBtnEn;
  const langBtnTooltip = lang === "en" ? t.langBtnPtTooltip : t.langBtnEnTooltip;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
      onClick={onClose} // closes when clicking on overlay
    >
      <div
        className="bg-white text-dark p-4 rounded shadow position-relative"
        style={{ width: "80%", maxWidth: "700px", maxHeight: "90%", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside content
      >
        {/* "X" Close button in top-right corner */}
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-3"
          aria-label="Close"
          onClick={onClose}
        ></button>

        {/* Title */}
        <h3 className="mb-3 text-primary">{t.title}</h3>

        {/* About Section */}
        <section className="mb-4">
          <h5 className="fw-bold">{t.aboutSystemTitle}</h5>
          <p>{t.aboutSystemText1}</p>
          <p>{t.aboutSystemText2}</p>
        </section>

        {/* Tutorial Section */}
        <section className="mb-4">
          <h5 className="fw-bold">{t.tutorialTitle}</h5>
          <p>{t.tutorialIntro}</p>
          <ol>
            {t.tutorialSteps.map((step, idx) => {
              // If idx == 1, we insert the sublist right after
              if (idx === 1) {
                return (
                  <React.Fragment key={idx}>
                    <li>{step}</li>
                    <ul>
                      {t.tutorialSubList.map((subItem, sidx) => (
                        <li key={sidx}>{subItem}</li>
                      ))}
                    </ul>
                  </React.Fragment>
                );
              }
              return <li key={idx}>{step}</li>;
            })}
          </ol>
          <p>{t.tutorialConclusion}</p>
        </section>

        {/* Project Info */}
        <section className="mb-4">
          <h5 className="fw-bold">{t.projectInfoTitle}</h5>
          <ul className="list-unstyled">
            <li>
              <strong>{t.nameLabel}:</strong> SkyClear System
            </li>
            <li>
              <strong>{t.versionLabel}:</strong> 1.0
            </li>
            <li>
              <strong>{t.lastReleaseLabel}:</strong> 01/29/2025
            </li>
            <li>
              <strong>{t.authorLabel}:</strong> Daniel Marnet
            </li>
            {/* New lines for repo and site */}
            <li>
              <strong>GitHub Repo:</strong>{" "}
              <a
                href="https://github.com/dmarnet/SkyClear"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/dmarnet/SkyClear
              </a>
            </li>
            <li>
              <strong>Web Page:</strong>{" "}
              <a
                href="https://skyclear-925d0.web.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                skyclear-925d0.web.app
              </a>
            </li>
          </ul>
        </section>

        {/* Author Contact */}
        <section className="mb-4">
          <h5 className="fw-bold">{t.contactTitle}</h5>
          <p>
            <strong>{t.emailLabel}:</strong>{" "}
            <a href="mailto:delmarnet1@gmail.com">delmarnet1@gmail.com</a>
            <br />
            <strong>{t.linkedInLabel}:</strong>{" "}
            <a
              href="https://linkedin.com/in/danielmarnet"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/danielmarnet
            </a>
            <br />
            <strong>{t.githubLabel}:</strong>{" "}
            <a
              href="https://github.com/dmarnet"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/dmarnet
            </a>
            <br />
            <strong>{t.portfolioLabel}:</strong>{" "}
            <a
              href="https://dmarnetcv.web.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              dmarnetcv.web.app
            </a>
          </p>
        </section>

        {/* Physical Components & Architecture */}
        <section className="mb-4">
          <h5 className="fw-bold">{t.physArchTitle}</h5>
          <p>{t.physArchText}</p>
          <ul>
            {t.physArchList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Firmware Summary */}
        <section className="mb-4">
          <h5 className="fw-bold">{t.firmwareSummaryTitle}</h5>
          <p>{t.firmwareSummaryText}</p>
          <ol>
            {t.firmwareSummaryList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </section>

        {/* Requirements */}
        <section className="mb-4">
          <h5 className="fw-bold">{t.requirementsTitle}</h5>
          <ul>
            {t.requirementsList.map((reqItem, idx) => (
              <li key={idx}>{reqItem}</li>
            ))}
          </ul>
        </section>

        {/* Final Remarks */}
        <section>
          <h5 className="fw-bold">{t.finalRemarksTitle}</h5>
          <p>{t.finalRemarksText}</p>
        </section>

        {/* Footer with "Close" and Language Toggle Buttons */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          {/* "Close" Button */}
          <button className="btn btn-outline-primary" onClick={onClose}>
            {t.closeBtn}
          </button>

          {/* Language Toggle Button */}
          <button
            className="btn btn-outline-secondary"
            title={langBtnTooltip}
            onClick={handleToggleLanguage}
          >
            {langBtnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocModal;
