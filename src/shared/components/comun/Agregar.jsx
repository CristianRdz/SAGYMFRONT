import React from "react";
import { Button } from "primereact/button";

export const Agregar = ({ setisEditting, setisOpen }) => {
  return (
    <Button
      label="Agregar"
      icon="pi pi-plus"
      onClick={() => {
        setisEditting(false);
        setisOpen(true);
      }}
      style={{
        position: "absolute",
        right: "0",
        marginRight: "5%",
        marginTop: "3%",
        marginBottom: "3%",
        backgroundColor: "#193c72",
        color: "white",
        border: "none",
      }}
    />
  );
};
