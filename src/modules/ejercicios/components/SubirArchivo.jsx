import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import adjuntosService from "../../../shared/services/adjuntos/adjuntosService";
import {
  deleteFile,
  uploadFile,
  watchInfo,
} from "../../../shared/services/adjuntos/externalService";
import "../../../shared/style/estilos.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
const tiposArchivo = [
  { label: "YouTube", value: "youtube" },
  { label: "Imagen", value: "imagen" },
  { label: "Archivo", value: "archivo" },
  { label: "Enlace", value: "enlace" },
];

export default function SubirArchivo({
  ejercicio,
  isOpen,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
  onClose,
}) {
  const toast = React.createRef();
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [enlace, setEnlace] = useState("");
  const [tipoElemento, setTipoElemento] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmSended, setConfirmSended] = useState(false);
  const [alert, setAlert] = useState(null);
  const formik = useFormik({
    initialValues: {
      nombreArchivo: "",
      enlace: "",
      tipoElemento: "",
    },
    validateOnChange: false,
    onSubmit: async (values) => {
      setConfirmSended(true);
      setLoading(true);
      if (formik.isValid) {
        await adjuntosService.create(
          values.nombreArchivo,
          values.enlace,
          values.tipoElemento,
          ejercicio
        );
        setLoading(false);
        setMensajeAlerta("Archivo subido correctamente");
        setMostrarAlerta(true);
        setTipoAlerta("success");

        resetAll();
      }
    },
    validationSchema: Yup.object({
      nombreArchivo: Yup.string().required(
        "El nombre del archivo es obligatorio"
      ),
      enlace: Yup.string().required("El enlace es obligatorio"),
      tipoElemento: Yup.string().required("El tipo de elemento es obligatorio"),
    }),
  });

  const onTipoElementoChange = (e) => {
    formik.setFieldValue("tipoElemento", e.value);
    setTipoElemento(e.value);
  };

  const onUpload = async (e) => {
    setIsUploading(true);
    const file = e.files[0];
    const res = await uploadFile(file);
    if (res.enlace) {
      setEnlace(res.enlace);
      formik.setFieldValue("enlace", res.enlace);
      const id = res.enlace.split("/")[3];
      let archivo = await watchInfo(id);
      if (archivo) {
        setNombreArchivo(archivo.nombre);
        formik.setFieldValue("nombreArchivo", archivo.nombre);
      }
      setAlert(true);
    } else {
      setLoading(false);
      setAlert(false);
    }
  };
  const resetAll = () => {
    if (!confirmSended) {
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
    setNombreArchivo("");
    setEnlace("");
    setAlert(null);
    setTipoElemento("");
    setIsUploading(false);
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog
      header="Subir archivo"
      visible={isOpen}
      style={{ width: "50vw" }}
      modal
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
            label="Guardar"
            icon="pi pi-save"
            onClick={formik.handleSubmit}
            className="p-button-success"
            type="submit"
            loading={loading}
          />
        </div>
      }
    >
      <Toast ref={toast} />
      {alert === false ? (
        <Message severity="error" text="No se ha podido subir el archivo." />
      ) : alert === true ? (
        <Message severity="success" text="Se ha subido el archivo." />
      ) : (
        <Message
          severity="info"
          text="Para subir un archivo tiene que seleccionar imagen o archivo."
        />
      )}
      <div className="p-field">
        <label htmlFor="nombreArchivo">Nombre del archivo</label>
        <InputText
          id="nombreArchivo"
          className="input"
          value={nombreArchivo}
          onChange={(e) => {
            formik.setFieldValue("nombreArchivo", e.target.value);
            setNombreArchivo(e.target.value);
          }}
        />
      </div>
      {formik.errors.nombreArchivo && formik.touched.nombreArchivo && (
        <small className="p-error">{formik.errors.nombreArchivo}</small>
      )}
      <div className="p-field">
        <label htmlFor="tipoElemento">Tipo de elemento</label>
        <Dropdown
          id="tipoElemento"
          disabled={isUploading}
          value={tipoElemento}
          options={tiposArchivo}
          onChange={onTipoElementoChange}
          placeholder="Seleccione tipo de archivo"
          className="input"
        />
      </div>
      {formik.errors.tipoElemento && formik.touched.tipoElemento && (
        <small className="p-error">{formik.errors.tipoElemento}</small>
      )}
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
