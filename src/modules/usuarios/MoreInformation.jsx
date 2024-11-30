import React from "react";

//primereact
import { Dialog } from "primereact/dialog";
import "../../shared/style/estilos.css";

export const MoreInformation = ({ isOpen, onClose, usuario }) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      header="Más información"
      visible={isOpen}
      style={{ width: "50vw" }}
      onHide={handleClose}
    >
      <div className="card">
        <div className="card-title">
          <i className="pi pi-user"></i>
          <span>Nombre</span>
        </div>
        <div className="card-content">{usuario.nombre}</div>
      </div>

      <div className="card">
        <div className="card-title">
          <i className="pi pi-sort-numeric-up-alt"></i>
          <span>Altura</span>
        </div>
        <div className="card-content">{usuario.altura}cm</div>
      </div>

      <div className="card">
        <div className="card-title">
          <i className="pi pi-arrow-right-arrow-left"></i>
          <span>Peso</span>
        </div>
        <div className="card-content">{usuario.peso}kg</div>
      </div>
    </Dialog>
  );
};
