// src/App.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import fundoSkyClear from "./assets/fundoSkyClear.png";

import DocModal from "./components/DocModal";
import CardSkyClear from "./components/CardSkyClear";
import ChartSkyClear from "./components/ChartSkyClear";

/* Lista de chaves que iremos exibir
const DATA_KEYS = [
  "PIDcontrol", "combustion", "powerCombustion", "fuel",
  "electric", "powerElectric", "batteryLevel", "solar", "solarCharge",
  "currentCO2", "totalCO2", 
  "CO2NotEmittedCurrentElectric", "CO2NotEmittedTotalElectric",
  "CO2NotEmittedCurrentSolar", "CO2NotEmittedTotalSolar"
];*/

// Valores default quando não há JSON principal
const DEFAULT_DATA = {
  PIDcontrol: "Off",
  combustion: "Off",
  powerCombustion: 0,
  fuel: 0,
  electric: "Off",
  powerElectric: 0,
  batteryLevel: 0,
  solar: "Off",
  solarCharge: 0,
  currentCO2: 0,
  totalCO2: 0,
  CO2NotEmittedCurrentElectric: 0,
  CO2NotEmittedTotalElectric: 0,
  CO2NotEmittedCurrentSolar: 0,
  CO2NotEmittedTotalSolar: 0
};

function App() {
  const [arduinoData, setArduinoData] = useState(DEFAULT_DATA);
  const [statusMessages, setStatusMessages] = useState([]);
  const [showDoc, setShowDoc] = useState(false);

  // Lê JSON principal do Firebase (arduinoData) em tempo real
  useEffect(() => {
    // Acessa a referência "arduinoData" no Realtime Database
    const mainRef = ref(db, "arduinoData");

    // Inscreve-se no evento 'onValue', que é chamado sempre que houver mudanças
    const unsubscribeMain = onValue(mainRef, (snapshot) => {
      const data = snapshot.val();

      if (data && typeof data == "object" && !("info" in data)) {
        // Se veio um objeto válido e não é apenas uma mensagem "info", atualiza o estado
        setArduinoData(data);
        //setServerOnline(true);
      } else if ("info" in data) {
        // Se veio info, atualiza as mensagens de status
        setStatusMessages(Array.isArray(data) ? data : [data]);
      } else {
        // Se não veio nada, usa o DEFAULT_DATA
        setArduinoData(DEFAULT_DATA);
      }      
    });

    // Retorna uma função de limpeza para remover o listener ao desmontar
    return () => unsubscribeMain();
  }, []);

  // Função para enviar comandos de "toggle" ao Node 
  const toggleButton = async (type) => {
    try {
      // Exemplo: POST /toggle/combustao
      await axios.post(`http://localhost:3001/toggle/${type}`);
      // Aqui não precisamos mais chamar fetchArduinoData(),
      // pois os dados serão atualizados automaticamente pelo Firebase
    } catch (error) {
      console.error("Erro ao enviar comando Toggle:", error);
    }
  };

  const [serverOnline, setServerOnline] = useState(null);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get("http://localhost:3001/status");
        if (response.status === 200) {
          setServerOnline(true);
        }
      } catch (error) {
        setServerOnline(false);
      }
    };

    checkServer();
  }, []);

  const toggleDoc = () => setShowDoc((prev) => !prev);

  return (
    <div
      className="container-fluid text-center text-white p-3"
      style={{
        backgroundImage: `url(${fundoSkyClear})`,
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh"
      }}
    >
      {/* Título principal */}
      <div className="row align-items-center">
        {/* Coluna vazia */}
        <div className="col"></div>

        {/* Título centralizado */}
        <div className="col text-center">
          <h1
            className="p-3 hover-primary"
            style={{ cursor: "pointer", color: "white" }}
            onClick={toggleDoc}
            title="About SkyClear System"
          >
            SkyClear System
          </h1>
        </div>

        {/* Botão alinhado à direita */}
        <div className="col text-end">
          <button
            type="button"
            className="btn btn-link"
            onClick={toggleDoc}
            title="Tutorial"
          >
            <i className="bi bi-question-circle" style={{ fontSize: "1.5rem" }}></i>
          </button>
        </div>
      </div>
      <DocModal show={showDoc} onClose={toggleDoc} />

      <div className="container-fluid mt-4">
        {/* STATUS SECTION */}
        <h2 className="mb-1">System Status</h2>

        {/* Linha principal com duas colunas */}
        <div className="row justify-content-between align-items-start border rounded p-1">
          
          {/* Coluna 1 (esquerda) - Botões de Controle */}
          <div className="col-4">
            <h4 className="mb-4">Control Buttons</h4>

            {/* 1) Combustion */}
            <div className="mb-4 text-center">
              <span className="d-block mb-2">Combustion On/Off</span>
              <button
                type="button"
                className="btn rounded p-0"
                style={{
                  backgroundColor: arduinoData.combustion === "On" ? "red" : "white",
                  color: arduinoData.combustion === "On" ? "white" : "red",
                  width: "50px",
                  height: "50px"
                }}
                title="Combustion engine control button"
                onClick={() => toggleButton("combustao")}
              >
                <i className="bi bi-fire fs-3 text-center"></i>
              </button>
            </div>

            {/* 2) Electric */}
            <div className="mb-4 text-center">
              <span className="d-block mb-2">Electric On/Off</span>
              <button
                type="button"
                className="btn rounded p-0"
                style={{
                  backgroundColor: arduinoData.electric === "On" ? "blue" : "white",
                  color: arduinoData.electric === "On" ? "white" : "blue",
                  width: "50px",
                  height: "50px"
                }}
                title="Electric motor control button"
                onClick={() => toggleButton("eletrico")}
              >
                <i className="bi bi-lightning fs-3 text-center"></i>
              </button>
            </div>

            {/* 3) PID */}
            <div className="mb-4 text-center">
              <span className="d-block mb-2">PID Control On/Off</span>
              <button
                type="button"
                className="btn rounded p-0"
                style={{
                  backgroundColor: arduinoData.PIDcontrol === "On" ? "green" : "white",
                  color: arduinoData.PIDcontrol === "On" ? "white" : "green",
                  width: "50px",
                  height: "50px"
                }}
                title="PID control button"
                onClick={() => toggleButton("pid")}
              >
                <i className="bi bi-sliders fs-3 text-center"></i>
              </button>
            </div>
          </div>
          
          {/* Coluna 2 (direita) */}
          <div className="col-8 align-items-center">
            {/* Primeira linha: System LEDs */}
            <div className="row mb-4">
              <div className="col-12">
                <h4>System LEDs</h4>
                <div className="d-flex justify-content-between mt-3">
                  {[
                    { key: "combustion", label: "Combustion", color: "danger" },
                    { key: "electric", label: "Electric", color: "primary" },
                    { key: "solar", label: "Solar", color: "warning" },
                    { key: "PIDcontrol", label: "PID", color: "success" }
                  ].map(({ key, label, color }) => (
                    <div key={key} className="text-center">
                      <p className="mb-1">{label} LED</p>

                      {/* Círculo branco, com ícone dentro */}
                      <div
                        className="rounded-circle bg-white d-flex align-items-center justify-content-center mx-auto p-0"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i
                          className={`bi bi-lightbulb-fill fs-1 ${
                            arduinoData[key] === "On"
                              ? `text-${color}`
                              : "text-white"
                          }`}
                        ></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Segunda linha: System Messages */}
            <div className="row">
              <div className="col-12">
                <h4>System Messages</h4>
                <div className="mt-3">
                  {serverOnline === null ? (
                    <p>Checking connection...</p>
                  ) : serverOnline ? (
                    <p style={{ color: "green" }}>🟢 Connected Server</p>
                  ) : (
                    <p style={{ color: "blue" }}>🔵 Read Only Access</p>
                  )}
                  {statusMessages.map((data, idx) => (
                    <div key={idx} className="alert alert-info bg-white">
                      {data.info}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Terceira linha: Fuel and Battery Level Alert */}
            <div className="row mt-2">
              <div className="col-12">
                {arduinoData.batteryLevel < 20 && arduinoData.fuel < 20 && (
                  <h5 className="d-flex text-danger p-0 bg-white border rounded justify-content-center align-items-center"> 
                    {/* Ícone de exclamação */}
                    <i
                      className="bi bi-exclamation-triangle-fill m-1 me-3 fs-1 text-danger"
                      title="Alert!"
                    ></i>
                    {/* Se batteryLevel < 20 e fuel < 20, mostra mensagem em vermelho */}
                      Fuel and Battery Level in Critical Situation
                  </h5>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-5">
        {/* CARDS SECTION */}
        <h2 className="mb-1">Dashboard</h2>

        <div className="row justify-content-between align-items-start border rounded p-1">
          {/* Combustion */}
          <div className="col-md-4">
            <h4 className="mt-4 mb-1">Combustion</h4>
            <CardSkyClear
              title="Combustion Engine"
              value={arduinoData.combustion}
              unit=""
              icon="bi bi-fire"
              bgColor="bg-white"
              textColor="text-danger"
            />
            <CardSkyClear
              title="Power Combustion Load"
              value={arduinoData.powerCombustion}
              unit="%"
              icon="bi bi-speedometer"
              bgColor="bg-white"
              textColor="text-danger"
            />
            <CardSkyClear
              title="Fuel Level"
              value={arduinoData.fuel}
              unit="%"
              icon="bi bi-droplet-half"
              bgColor="bg-white"
              textColor="text-danger"
            />
          </div>

          {/* Electric & Solar */}
          <div className="col-md-4">
            <h4 className="mt-4 mb-1">Electric & Solar</h4>
            <CardSkyClear
              title="Electric Motor"
              value={arduinoData.electric}
              unit=""
              icon="bi bi-lightning"
              bgColor="bg-white"
              textColor="text-primary"
            />
            <CardSkyClear
              title="Power Electric Load"
              value={arduinoData.powerElectric}
              unit="%"
              icon="bi bi-speedometer"
              bgColor="bg-white"
              textColor="text-primary"
            />
            <CardSkyClear
              title="Battery Level"
              value={arduinoData.batteryLevel}
              unit="%"
              icon="bi bi-battery-half"
              bgColor="bg-white"
              textColor="text-primary"
            />
            <CardSkyClear
              title="Solar Energy"
              value={arduinoData.solar}
              unit=""
              icon="bi bi-sun"
              bgColor="bg-white"
              textColor="text-warning"
            />
            <CardSkyClear
              title="Solar Charge"
              value={arduinoData.solarCharge}
              unit="%"
              icon="bi bi-battery-charging"
              bgColor="bg-white"
              textColor="text-warning"
            />
          </div>

          {/* CO2 Emissions */}
          <div className="col-md-4">
            <h4 className="mt-4 mb-1">CO2 Emissions</h4>
            <CardSkyClear
              title="PID Control"
              value={arduinoData.PIDcontrol}
              unit=""
              icon="bi bi-sliders"
              bgColor="bg-white"
              textColor="text-success"
            />
            <CardSkyClear
              title="Current CO2 Saved by Electric Motor"
              value={arduinoData.CO2NotEmittedCurrentElectric}
              unit=" u."
              icon="bi bi-cloud-check"
              bgColor="bg-white"
              textColor="text-success"
            />
            <CardSkyClear
              title="Total CO2 Saved by Electric Motor"
              value={arduinoData.CO2NotEmittedTotalElectric}
              unit=" u."
              icon="bi bi-cloud-check-fill"
              bgColor="bg-white"
              textColor="text-success"
            />
            <CardSkyClear
              title="Current CO2 Saved by Solar Energy"
              value={arduinoData.CO2NotEmittedCurrentSolar}
              unit=" u."
              icon="bi bi-sun"
              bgColor="bg-white"
              textColor="text-success"
            />
            <CardSkyClear
              title="Total CO2 Saved by Solar Energy"
              value={arduinoData.CO2NotEmittedTotalSolar}
              unit=" u."
              icon="bi bi-sun-fill"
              bgColor="bg-white"
              textColor="text-success"
            />
            <CardSkyClear
              title="Current CO2 Emission"
              value={arduinoData.currentCO2}
              unit=" u."
              icon="bi bi-cloud-haze2"
              bgColor="bg-white"
              textColor="text-dark"
            />
            <CardSkyClear
              title="Total CO2 Emission"
              value={arduinoData.totalCO2}
              unit=" u."
              icon="bi bi-cloud-haze2-fill"
              bgColor="bg-white"
              textColor="text-dark"
            />
          </div>
        </div>
      </div>
      <div className="container-fluid mt-5">
        {/* CHARTS SECTION */}
        <h2 className="mb-1">Charts</h2>

        <div className="row justify-content-between align-items-start border rounded p-1">
          {/* Combustion */}
          <div className="col-md-4">
            <h4 className="mt-4 mb-1">Combustion</h4>
            <ChartSkyClear
              chartKey="powerCombustion"
              label="Power Combustion Load"
              data={arduinoData}
              unit="%"
              bgColor="red"
            />
            <ChartSkyClear
              chartKey="fuel"
              label="Fuel Level"
              data={arduinoData}
              unit="%"
              bgColor="red"
            />
          </div>

          {/* Electric & Solar */}
          <div className="col-md-4">
            <h4 className="mt-4 mb-1">Electric & Solar</h4>
            <ChartSkyClear
              chartKey="powerElectric"
              label="Power Electric Load"
              data={arduinoData}
              unit="%"
              bgColor="blue"
            />
            <ChartSkyClear
              chartKey="batteryLevel"
              label="Battery Level"
              data={arduinoData}
              unit="%"
              bgColor="blue"
            />
            <ChartSkyClear
              chartKey="solarCharge"
              label="Solar Charge"
              data={arduinoData}
              unit="%"
              bgColor="orange"
            />
          </div>

          {/* CO2 Emissions */}
          <div className="col-md-4">
            <h4 className="mt-4 mb-1">CO2 Emissions</h4>
            <ChartSkyClear
              chartKey="CO2NotEmittedCurrentElectric"
              label="Current CO2 Saved by Electric Motor"
              data={arduinoData}
              unit="u."
              bgColor="green"

            />
            <ChartSkyClear
              chartKey="CO2NotEmittedTotalElectric"
              label="Total CO2 Saved by Electric Motor"
              data={arduinoData}
              unit="u."
              bgColor="green"
            />
            <ChartSkyClear
              chartKey="CO2NotEmittedCurrentSolar"
              label="Current CO2 Saved by Solar Energy"
              data={arduinoData}
              unit="u."
              bgColor="green"
            />
            <ChartSkyClear
              chartKey="CO2NotEmittedTotalSolar"
              label="Total CO2 Saved by Solar Energy"
              data={arduinoData}
              unit="u."
              bgColor="green"
            />
            <ChartSkyClear
              chartKey="currentCO2"
              label="Current CO2 Emission"
              data={arduinoData}
              unit="u."
              bgColor="black"
            />
            <ChartSkyClear
              chartKey="totalCO2"
              label="Total CO2 Emission"
              data={arduinoData}
              unit="u."
              bgColor="black"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted py-3">
        <p className="m-0">
          © 2025 <strong>SkyClear System</strong> · Developed by{" "}
          <a
            href="https://dmarnetcv.web.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none text-dark fw-medium hover-primary"
            title="Contact and more information"
          >
            Daniel Marnet
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
