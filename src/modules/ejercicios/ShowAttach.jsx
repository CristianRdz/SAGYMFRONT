import React from "react";

//primereact
import { Dialog } from "primereact/dialog";
import "../../shared/style/estilos.css";
import VerAdjuntos from "./components/VerAdjuntos";
import SubirArchivo from "./components/SubirArchivo";

export const ShowAttach = ({
  ejercicio,
  isOpen,
  onClose,
  setisLoading,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
}) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      header={`Adjuntos de ${ejercicio.nombre}`}
      visible={isOpen}
      style={{ width: "50vw" }}
      onHide={handleClose}
      maximizable={true}
    >
      {ejercicio && (
        <VerAdjuntos
          ejercicio={ejercicio}
          isOpen={isOpen}
          setMensajeAlerta={setMensajeAlerta}
          setMostrarAlerta={setMostrarAlerta}
          setTipoAlerta={setTipoAlerta}
          setisLoading={setisLoading}
          onClose={handleClose}
        />
      )}
    </Dialog>
  );
};
