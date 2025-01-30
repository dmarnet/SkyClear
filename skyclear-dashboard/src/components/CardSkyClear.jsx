// src/components/CardSkyClear.jsx
import React from 'react';

/**
 * CardSkyClear
 * Props:
 * - title: string
 * - value: number/string
 * - unit: string
 * - icon: string (ex: "bi bi-gear")
 * - bgColor: default = "bg-white"
 * - textColor: default = "text-dark"
 */
function CardSkyClear({
  title,
  value,
  unit,
  icon,
  bgColor = 'bg-white',
  textColor = 'text-dark'
}) {
  return (
    <div className={`card p-0 pt-3 mb-4 border-1 mx-5 text-center fs-4 ${bgColor} ${textColor}`}>
      <h6 className="d-flex align-items-center text-start fs-7 p-0 m-0 ms-4">
        {icon && <i className={`${icon} p-0 me-2 fs-4 bolder`}></i>}
        {title}:
      </h6>
      <p>
        {value}
        {unit ? `${unit}` : ''}
      </p>
    </div>
  );
}

export default CardSkyClear;
