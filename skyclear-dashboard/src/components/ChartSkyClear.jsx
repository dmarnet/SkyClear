// src/components/ChartSkyClear.jsx
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function ChartSkyClear({
  chartKey,       // identificador único
  label,          // label do dataset
  data,    // valor mais recente (numérico)
  unit = "",      // unidade de medida (ex: "%", "u.")
  bgColor = "bg-white",
  textColor = "text-dark",
}) {
  const canvasRef = useRef(null);

  // Armazenamos a instância do Chart e também arrays de labels e data local
  const chartInstanceRef = useRef(null);
  const labelsRef = useRef([]);
  const valuesRef = useRef([]);

  useEffect(() => {
    // Se não existe chart, cria
    if (!chartInstanceRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: unit ? `${label} (${unit})` : label,
              data: [],
              borderColor: bgColor,
              backgroundColor: "rgba(0, 123, 255, 0.1)",
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { display: false },
            y: { beginAtZero: true },
          },
          plugins: {
            legend: { display: true },
          },
        },
      });
    }
  }, [label, unit, bgColor]);

  // Sempre que data mudar, inserimos novo ponto
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    const nowLabel = new Date().toLocaleTimeString();
    labelsRef.current.push(nowLabel);
    valuesRef.current.push(data[chartKey]);

    // Limitamos a 20 pontos (exemplo)
    if (labelsRef.current.length > 20) {
      labelsRef.current.shift();
      valuesRef.current.shift();
    }

    const chart = chartInstanceRef.current;
    chart.data.labels = [...labelsRef.current];
    chart.data.datasets[0].data = [...valuesRef.current];
    chart.update();
  }, [data, chartKey]);

  return (
    <div className={`card p-3 mx-2 mb-4 border-1 ${bgColor} ${textColor}`} style={{ height: "270px" }}>
      <h6>{unit ? `${label} (${unit})` : label}</h6>
      <canvas
        ref={canvasRef}
        style={{
          maxHeight: "200px",
          width: "100%",
        }}
      />
    </div>
  );
}

export default ChartSkyClear;
