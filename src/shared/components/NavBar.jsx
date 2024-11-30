import React from "react";
import { useNavigate } from "react-router-dom";

//primereact
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import "../style/estilos.css";

export const NavBar = () => {
  const navigation = useNavigate();
  const closeSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rol");
    navigation("/");
    window.location.reload();
  };

  const endItems = [
    <Button
      key="profile"
      className="p-button-rounded"
      style={{ backgroundColor: "#102b51", border: "none" }}
      onClick={() => (window.location.href = "/perfil")}
    >
      <i className="pi pi-user" style={{ fontSize: "25px" }} />
    </Button>,
    <span key="separator" style={{ margin: "0 0.5rem" }}></span>,

    <Button
      key="logout"
      className="p-button-rounded p-button-danger"
      style={{ border: "none" }}
      onClick={closeSession}
    >
      <i className="pi pi-sign-out" style={{ fontSize: "25px" }} />
    </Button>,
  ];

  return (
    <div className="nav">
      <img
        src="http://129.146.111.32:3000/64169a21f2d9535f691ed671"
        alt="Logo"
        className="navImg"
        onClick={() => (window.location.href = "/")}
      />
      <Menubar
        end={endItems}
        style={{ backgroundColor: "#179275", height: "80px", border: "none" }}
      />
    </div>
  );
};
