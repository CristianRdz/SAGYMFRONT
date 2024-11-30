import React from "react";
import "./errorstyle.css";
import "typeface-raleway";

export const Error = () => {
  return (
    <div>
      {" "}
      <header class="top-header"></header>
      <div>
        <div class="starsec"></div>
        <div class="starthird"></div>
        <div class="starfourth"></div>
        <div class="starfifth"></div>
      </div>
      <div class="lamp__wrap">
        <div class="lamp">
          <div class="cable"></div>
          <div class="cover"></div>
          <div class="in-cover">
            <div class="bulb"></div>
          </div>
          <div class="light"></div>
        </div>
      </div>
      <section class="error">
        <div class="error__content">
          <div class="error__message message">
            <h1 class="message__title">Pagina no encontrada</h1>
            <p class="message__text"
              style={{
                fontFamily: "Raleway",
                marginBottom: "2%",
              }}

            >
              Lo lamentamos, no logramos encontrar esta pagina
            </p>
            <a
              href="/"
              style={{
                backgroundColor: "#193c72",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                textDecoration: "none",
                marginTop: "5%",
                fontFamily: "Raleway",
                
              }}
            >
              Volver
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
