import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import adjuntosService from "../../../shared/services/adjuntos/adjuntosService";
import "../../../shared/style/estilos.css";
import {
  deleteFile,
  updateFile,
} from "../../../shared/services/adjuntos/externalService";
import Alert, { confirmMsj, confirmTitle } from "../../../shared/plugins/alert";
import ActualizarAdjunto from "./ActualizarAdjunto";
import { Dialog } from "primereact/dialog";

export default function VerAdjuntos({
  ejercicio,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
  isOpen,
  onClose,
}) {
  const [adjuntos, setAdjuntos] = useState([]);
  const [filteredAdjuntos, setFilteredAdjuntos] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [adjunto, setAdjunto] = useState(null);

  const eliminarAdjunto = async (adjunto) => {
    try {
      try {
        return Alert.fire({
          title: confirmTitle,
          text: confirmMsj,
          icon: "warning",
          confirmButtonColor: "#009574",
          confirmButtonText: "Aceptar",
          cancelButtonColor: "#DD6B55",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
          backdrop: true,
          showCancelButton: true,
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Alert.isLoading,
          preConfirm: async () => {
            try {
              const id_adjunto = adjunto.id_elemento;
              const enlace = adjunto.enlace;
              if (enlace.includes("http://129.146.111.32:3000/")) {
                const id = enlace.split("/")[3];
                await deleteFile(id);
              }
              await adjuntosService.deleteById(id_adjunto);
              setMensajeAlerta("Archivo eliminado correctamente.");
              setTipoAlerta("success");
              setMostrarAlerta(true);
              onClose();
            } catch (error) {
              setMensajeAlerta("Error al eliminar el Archivo.");
              setTipoAlerta("error");
              setMostrarAlerta(true);
            }
          },
        });
      } catch (error) {
        setMensajeAlerta("Error al eliminar el Archivo.");
        setTipoAlerta("error");
        setMostrarAlerta(true);
        onClose();
      }
    } catch (error) {
      setMensajeAlerta("Error al eliminar el ejercicio.");
      setTipoAlerta("error");
      setMostrarAlerta(true);
    }
  };

  const obtenerAdjuntos = async () => {
    adjuntosService.getByEjercicio(ejercicio.id_ejercicio).then((res) => {
      setAdjuntos(res.data);
      setFilteredAdjuntos(res.data);
    });
  };
  useEffect(() => {
    obtenerAdjuntos();
  }, []);

  const getThumbnailUrl = (enlace) => {
    //https://youtu.be/BGTZuVKTu8U or https://www.youtube.com/watch?v=BGTZuVKTu8U
    let videoId = "";
    if (enlace.includes("youtu.be")) {
      videoId = enlace.split("youtu.be/")[1];
    } else if (enlace.includes("youtube.com")) {
      videoId = enlace.split("=")[1];
    } else {
      videoId = enlace.split("&")[0];
    }
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const adjuntoTemplate = (adjunto) => {
    if (adjunto.tipo_elemento === "youtube") {
      return (
        <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
          <div className="mb-3 flex mx-auto justify-center">
            <img
              src={getThumbnailUrl(adjunto.enlace)}
              alt={adjunto.nombre_archivo}
              className="w-6 shadow-2"
              style={{
                borderRadius: "10px",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
          <div>
            <h4 className="mb-1">{adjunto.nombre_archivo}</h4>
            <Tag value={adjunto.tipo_elemento} />
            <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
              <Button
                label="Ver"
                icon="pi pi-eye"
                className="p-button p-button-success"
                type="button"
                onClick={() => {
                  window.open(adjunto.enlace, "_blank");
                }}
                style={{
                  marginLeft: ".25em",
                  marginRight: ".25em",
                  marginTop: "2em",
                  marginBottom: "2em",
                }}
              />
              <Button
                label="Editar"
                icon="pi pi-pencil"
                className="p-button p-button-warning"
                type="button"
                onClick={() => {
                  setAdjunto(adjunto);
                  setShowUpdate(true);
                }}
                style={{
                  marginLeft: ".25em",
                  marginRight: ".25em",
                  marginTop: "2em",
                  marginBottom: "2em",
                }}
              />
              <Button
                label="Eliminar"
                icon="pi pi-trash"
                className="p-button p-button-danger"
                type="button"
                onClick={() => {
                  eliminarAdjunto(adjunto);
                }}
                style={{
                  marginLeft: ".25em",
                  marginRight: ".25em",
                  marginTop: "2em",
                  marginBottom: "2em",
                }}
              />
            </div>
          </div>
        </div>
      );
    } else if (adjunto.tipo_elemento === "imagen") {
      return (
        <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
          <div className="mb-3 center">
            <img
              src={adjunto.enlace}
              alt={adjunto.nombre_archivo}
              className="w-6 shadow-2"
              style={{
                borderRadius: "10px",
                maxHeight: "200px",
                maxWidth: "200px",
                height: "100%",
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
          <div>
            <h4 className="mb-1">{adjunto.nombre_archivo}</h4>
            <Tag value={adjunto.tipo_elemento} />
            <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
              <Button
                label="Ver"
                icon="pi pi-eye"
                className="p-button p-button-success"
                type="button"
                onClick={() => {
                  window.open(adjunto.enlace, "_blank");
                }}
                style={{
                  marginLeft: ".25em",
                  marginRight: ".25em",
                  marginTop: "2em",
                  marginBottom: "2em",
                }}
              />
              <Button
                label="Editar"
                icon="pi pi-pencil"
                className="p-button p-button-warning"
                type="button"
                onClick={() => {
                  setAdjunto(adjunto);
                  setShowUpdate(true);
                }}
                style={{
                  marginLeft: ".25em",
                  marginRight: ".25em",
                  marginTop: "2em",
                  marginBottom: "2em",
                }}
              />
              <Button
                label="Eliminar"
                icon="pi pi-trash"
                className="p-button p-button-danger"
                type="button"
                onClick={() => {
                  eliminarAdjunto(adjunto);
                }}
                style={{
                  marginLeft: ".25em",
                  marginRight: ".25em",
                  marginTop: "2em",
                  marginBottom: "2em",
                }}
              />
            </div>
          </div>
        </div>
      );
    } else if (
      adjunto.tipo_elemento === "enlace" ||
      adjunto.tipo_elemento === "archivo"
    ) {
      return (
        <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
          <div className="mb-3 flex mx-auto justify-center"></div>
          <div>
            <h4 className="mb-1">{adjunto.nombre_archivo}</h4>
            <Tag value={adjunto.tipo_elemento} />
            <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
              <Button
                label="Ver"
                icon="pi pi-eye"
                className="p-button p-button-success"
                type="button"
                onClick={() => {
                  window.open(adjunto.enlace, "_blank");
                }}
                style={{
                  marginLeft: ".25em",
                  marginRight: ".25em",
                  marginTop: "2em",
                  marginBottom: "2em",
                }}
              />
              <Button
                label="Editar"
                icon="pi pi-pencil"
                className="p-button p-button-warning"
                type="button"
                onClick={() => {
                  setAdjunto(adjunto);
                  setShowUpdate(true);
                }}
                style={{
                  marginLeft: ".25em",
                  marginRight: ".25em",
                  marginTop: "2em",
                  marginBottom: "2em",
                }}
              />
              <Button
                label="Eliminar"
                icon="pi pi-trash"
                className="p-button p-button-danger"
                type="button"
                onClick={() => {
                  eliminarAdjunto(adjunto);
                }}
                style={{
                  marginLeft: ".25em",
                  marginRight: ".25em",
                  marginTop: "2em",
                  marginBottom: "2em",
                }}
              />
            </div>
          </div>
        </div>
      );
    } else {
      <div></div>;
    }
  };

  const onGlobalFilterChange = (event) => {
    setGlobalFilter(event.target.value);
    setFilteredAdjuntos(
      adjuntos.filter((adjunto) => {
        return (
          adjunto.nombre_archivo
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          adjunto.tipo_elemento
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        );
      })
    );
  };

  return (
    <Dialog
      header={
        <div className="p-grid p-justify-between p-nogutter">
          <p className="p-col-12 p-md-9 mb-3">Adjuntos de {ejercicio.nombre}</p>
          <div className="p-col-12 p-md-3 mb-3">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                type="search"
                className="input"
                placeholder="Buscar adjunto"
                value={globalFilter}
                onChange={onGlobalFilterChange}
                style={{
                  marginLeft: ".25em",
                  marginRight: ".25em",
                }}
              />
            </span>
          </div>
        </div>
      }
      visible={isOpen}
      style={{ width: "50vw" }}
      onHide={onClose}
      maximizable={true}
    >
      <DataView
        value={filteredAdjuntos}
        itemTemplate={adjuntoTemplate}
        paginator
        paginatorPosition="bottom"
        rows={3}
        rowsPerPageOptions={[3, 5, 10]}
        className="p-dataview-responsive"
        emptyMessage="No se encontraron adjuntos."
      />
      {adjunto && (
        <ActualizarAdjunto
        setAdjunto={setAdjunto}
          adjunto={adjunto}
          isOpen={showUpdate}
          onClose={onClose}
          localClose={() => {
            setShowUpdate(false);
          }}
          ejercicio={ejercicio}
          setMensajeAlerta={setMensajeAlerta}
          setMostrarAlerta={setMostrarAlerta}
          setTipoAlerta={setTipoAlerta}
          obtenerAdjuntos={obtenerAdjuntos}
        />
      )}
    </Dialog>
  );
}
