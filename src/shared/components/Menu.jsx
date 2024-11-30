import React, { useEffect } from "react";
import "typeface-raleway";
import { IoIosFitness } from "react-icons/io";
import "../style/estilos.css";

export const Menu = () => {
  useEffect(() => {
    document.title = "SAGYM";
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      <div className="container body">
        <a className="buttonMenu" href="/usuarios">
          <i className="pi pi-user" style={{ fontSize: "170%" }}></i>
          <span className="span">Usuarios</span>
        </a>
        <a className="buttonMenu" href="/rutinas">
          <i className="pi pi-calendar" style={{ fontSize: "180%" }}></i>
          <span className="span">Rutinas</span>
        </a>
        <a className="buttonMenu" href="/ejercicios">
          <IoIosFitness style={{ fontSize: "200%" }} />
          <span className="span">Ejercicios</span>
        </a>
      </div>
    </div>
  );
};
