import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import adjuntosService from "../../../shared/services/adjuntos/adjuntosService";
import {
  deleteFile,
  uploadFile,
  updateFile,
  watchInfo,
} from "../../../shared/services/adjuntos/externalService";
import "../../../shared/style/estilos.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
import Alert, { confirmMsj, confirmTitle } from "../../../shared/plugins/alert";
const tiposArchivo = [
  { label: "YouTube", value: "youtube" },
  { label: "Imagen", value: "imagen" },
  { label: "Archivo", value: "archivo" },
  { label: "Enlace", value: "enlace" },
];

export default function ActualizarAdjunto({
  ejercicio,
  adjunto,
  setAdjunto,
  isOpen,
  onClose,
  localClose,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
}) {
  const [previoArchivo, setPrevioArchivo] = useState(false);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [enlace, setEnlace] = useState("");
  const [tipoElemento, setTipoElemento] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmSended, setConfirmSended] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombreArchivo: adjunto.nombre_archivo || "",
      enlace: adjunto.enlace || "",
      tipoElemento: adjunto.tipo_elemento || "",
    },
    validateOnChange: false,
    onSubmit: async (values) => {
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
          setConfirmSended(true);
          if (formik.isValid) {
            await adjuntosService.update(
              adjunto.id_elemento,
              values.nombreArchivo,
              values.enlace,
              values.tipoElemento,
              ejercicio
            );
            setMensajeAlerta("Archivo actualizado correctamente");
            setMostrarAlerta(true);
            setTipoAlerta("success");
            resetAll();
            onClose();
          }
        },
      });
    },
    validationSchema: Yup.object({
      nombreArchivo: Yup.string().required(
        "El nombre del archivo es obligatorio"
      ),
      enlace: Yup.string().required("El enlace es obligatorio"),
      tipoElemento: Yup.string().required("El tipo de elemento es obligatorio"),
    }),
  });

  useEffect(() => {
    setNombreArchivo(adjunto.nombreArchivo);
    if (adjunto.enlace.includes("http://129.146.111.32:3000/")) {
      setPrevioArchivo(true);
      setEnlace(adjunto.enlace);
    } else {
      setPrevioArchivo(false);
      setEnlace(adjunto.enlace);
    }
    setTipoElemento(adjunto.tipoElemento);
  }, [adjunto]);

  const resetAll = () => {
    if (!confirmSended && !previoArchivo) {
      // El servicio externo devuelve un enlace como este y debemos sacar el id para eliminarlo
      // http://129.146.111.32:3000/64169a21f2d9535f691ed671 si contiene http://129.146.111.32:3000/ lo eliminamos
      // 64169a21f2d9535f691ed671 es el id
      if (enlace.includes("http://129.146.111.32:3000/")) {
        const id = enlace.split("/")[3];
        deleteFile(id).then((res) => {
          console.log("res", res);
        });
      }
    }
    setAlert(null);
    setNombreArchivo("");
    setEnlace("");
    setTipoElemento("");
    formik.resetForm();
    setAdjunto(null);
    localClose();
  };
  const onUpload = async (event) => {
    try {
      setIsUploading(true);
      if (enlace.includes("http://129.146.111.32:3000/")) {
        const id = enlace.split("/")[3];
        const file = event.files[0];
        const formData = new FormData();
        formData.append("file", file);
        const response = await updateFile(id, file);
        if (response.file_id) {
          let archivo = await watchInfo(response.file_id);
          if (archivo) {
            setNombreArchivo(archivo.nombre);
            formik.setFieldValue("nombreArchivo", archivo.nombre);
          }
          const nuevoEnlace = `http://129.146.111.32:3000/${response.file_id}`;
          console.log(nuevoEnlace);
          formik.setFieldValue("enlace", nuevoEnlace);
          setEnlace(nuevoEnlace);
          setIsUploading(true);
          setAlert(true);
        } else {
          const file = event.files[0];
          const res = await uploadFile(file);
          if (res.enlace) {
            const id = res.enlace.split("/")[3];
            let archivo = await watchInfo(id);
            if (archivo) {
              setNombreArchivo(archivo.nombre);
              formik.setFieldValue("nombreArchivo", archivo.nombre);
            }
            setEnlace(res.enlace);
            formik.setFieldValue("enlace", res.enlace);
            setLoading(false);
            setAlert(true);
          } else {
            setLoading(false);
            setAlert(false);
          }
        }
      } else {
        const file = event.files[0];
        const res = await uploadFile(file);
        if (res.enlace) {
          const id = res.enlace.split("/")[3];
          let archivo = await watchInfo(id);
          if (archivo) {
            setNombreArchivo(archivo.nombre);
            formik.setFieldValue("nombreArchivo", archivo.nombre);
          }
          setEnlace(res.enlace);
          formik.setFieldValue("enlace", res.enlace);
          setIsUploading(true);
          setLoading(false);
          setAlert(true);
        } else {
          setLoading(false);
          setAlert(false);
        }
      }
    } catch (error) {
      console.log(error);
      setAlert(false);
    }
  };

  return (
    <Dialog
      header="Actualizar archivo"
      visible={isOpen}
      style={{ width: "50vw" }}
      modal
      className="p-fluid"
      onHide={resetAll}
      footer={
        <div>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={resetAll}
            className="p-button-danger"
          />
          <Button
            label="Actualizar"
            type="submit"
            loading={loading}
            icon="pi pi-check"
            className="p-button-warning"
            onClick={formik.handleSubmit}
            disabled={loading}
          />
        </div>
      }
    >
      <div className="p-field">
        {alert === false ? (
          <Message severity="error" text="No se ha podido subir el archivo." />
        ) : alert === true ? (
          <Message severity="success" text="Se ha subido el archivo." />
        ) : (
          <Message
            severity="info"
            text="Para subir un archivo diferente, cambie el selector de tipo de elemento."
          />
        )}
        <label htmlFor="nombreArchivo">Nombre del archivo</label>
        <InputText
          id="nombreArchivo"
          name="nombreArchivo"
          value={formik.values.nombreArchivo}
          onChange={formik.handleChange}
          className={`p-inputtext-sm ${
            formik.errors.nombreArchivo && "p-invalid"
          }`}
        />
        {formik.errors.nombreArchivo && (
          <small id="nombreArchivo-help" className="p-error">
            {formik.errors.nombreArchivo}
          </small>
        )}
      </div>
      <div className="p-field">
        <label htmlFor="tipoElemento">Tipo de elemento</label>
        <Dropdown
          id="tipoElemento"
          name="tipoElemento"
          value={formik.values.tipoElemento}
          options={tiposArchivo}
          onChange={(e) => {
            formik.setFieldValue("tipoElemento", e.value);
            setTipoElemento(e.value);
          }}
          className={`p-inputtext-sm ${
            formik.errors.tipoElemento && "p-invalid"
          }`}
        />
        {formik.errors.tipoElemento && (
          <small id="tipoElemento-help" className="p-error">
            {formik.errors.tipoElemento}
          </small>
        )}
      </div>
      {tipoElemento === "youtube" && (
        <div className="p-field">
          <label htmlFor="enlace">Enlace de YouTube</label>
          <InputText
            id="enlace"
            value={enlace}
            onChange={(e) => {
              formik.setFieldValue("enlace", e.target.value);
              setEnlace(e.target.value);
            }}
            className="input"
          />
        </div>
      )}
      {tipoElemento === "imagen" && (
        <div className="p-field">
          <FileUpload
            disabled={isUploading}
            mode="basic"
            accept="image/*"
            maxFileSize={16 * 1000000}
            customUpload
            uploadHandler={async (e) => {
              setLoading(true);
              await onUpload(e);
              setLoading(false);
            }}
            chooseLabel="Seleccionar imagen"
            className="input"
            auto
          />
        </div>
      )}
      {tipoElemento === "archivo" && (
        <div className="p-field">
          <FileUpload
            disabled={isUploading}
            mode="basic"
            maxFileSize={16 * 1000000}
            customUpload
            uploadHandler={async (e) => {
              setLoading(true);
              await onUpload(e);
              setLoading(false);
            }}
            chooseLabel="Seleccionar archivo"
            className="input"
            auto
          />
        </div>
      )}
      {tipoElemento === "enlace" && (
        <div className="p-field">
          <label htmlFor="enlace">Enlace</label>
          <InputText
            id="enlace"
            value={enlace}
            onChange={(e) => {
              formik.setFieldValue("enlace", e.target.value);
              setEnlace(e.target.value);
            }}
            className="input"
          />
        </div>
      )}
      {formik.errors.enlace && formik.touched.enlace && (
        <small className="p-error">{formik.errors.enlace}</small>
      )}
    </Dialog>
  );
}
