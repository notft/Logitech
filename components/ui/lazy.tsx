import React from "react";

const LazyText = () => {
  return (
    <svg
      width="600"
      height="200"
      viewBox="0 0 600 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="6rem"
        fontWeight="bold"
        fill="none"
        strokeWidth="2"
        strokeDasharray="1000"
        strokeDashoffset="1000"
      >
        <tspan
          stroke="#fff"
          fill="#fff" 
          className="logi-part"
        >
          Logi
        </tspan>
        <tspan
          stroke="#FF0000"
          fill="#FF0000"
          className="scale-part"
        >
          Scale
        </tspan>
      </text>
      <style>
        {`
          tspan {
            animation: stroke-anim 3s ease-out forwards;
          }
          .logi-part {
            stroke: #fff;
            fill-opacity: 0;
          }
          .scale-part {
            stroke: #FF0000;
            fill-opacity: 0;
          }
          @keyframes stroke-anim {
            0% {
              stroke-dashoffset: 1000;
            }
            70% {
              fill-opacity: 0; /* Keep fill hidden during stroke animation */
            }
            100% {
              stroke-dashoffset: 0;
              fill-opacity: 1; /* Reveal fill after stroke completes */
            }
          }
        `}
      </style>
    </svg>
  );
};

export default LazyText;
