import React, { useEffect } from "react";

import AxiosClient from "../../shared/plugins/axios";
import { useFormik } from "formik";
import * as Yup from "yup";

//primereact
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import Alert, { confirmMsj, confirmTitle } from "../../shared/plugins/alert";
import "../../shared/style/estilos.css";
import EjerciciosService from "../../shared/services/ejercicios/EjerciciosService";
export const ExerciseForm = ({
  isOpen,
  onClose,
  setEjercicio,
  setisLoading,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
}) => {
  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
    },
    validationSchema: Yup.object().shape({
      nombre: Yup.string().required("Por favor, el nombre del ejercicio"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setisLoading(true);
        const response = await EjerciciosService.create(
          values.nombre,
          values.descripcion
        );
        setisLoading(false);
        setMensajeAlerta("Ejercicio creado correctamente");
        setMostrarAlerta(true);
        setTipoAlerta("success");
        onClose();
        formik.resetForm();
      } catch (error) {
        setMensajeAlerta(error.message);
        setMostrarAlerta(true);
        setTipoAlerta("error");
        console.log(error);
      }
    },
  });

  useEffect(() => {
    document.title = "Crear Ejercicio";
  }, []);

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Dialog
      header="Crear Ejercicio"
      visible={isOpen}
      style={{ width: "30%" }}
      onHide={handleClose}
    >
      <form onSubmit={formik.handleSubmit}>
        <div>
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nombre">Nombre</label>
              <InputText
                id="nombre"
                name="nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                className={
                  formik.errors.nombre && formik.touched.nombre
                    ? "p-invalid p-d-block"
                    : ""
                }
                style={{
                  width: "100%",
                  borderRadius: "10px",
                }}
                placeholder="..."
              />
              {formik.errors.nombre && formik.touched.nombre && (
                <small className="p-error">{formik.errors.nombre}</small>
              )}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="descripcion">Descripción</label>
              <InputTextarea
                id="descripcion"
                name="descripcion"
                autoResize
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                className={
                  formik.errors.descripcion && formik.touched.descripcion
                    ? "p-invalid p-d-block"
                    : ""
                }
                rows={4}
                cols={30}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                }}
                placeholder="..."
              />
              {formik.errors.descripcion && formik.touched.descripcion && (
                <small className="p-error">{formik.errors.descripcion}</small>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <Button
            label="Limpiar"
            icon="pi pi-eraser"
            className="p-button-info"
            type="button"
            onClick={formik.handleReset}
          />

          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-danger"
            type="button"
            onClick={handleClose}
            style={{
              marginLeft: ".25em",
              marginRight: ".25em",
              marginTop: "1em",
            }}
          />
          <Button
            label="Guardar"
            icon="pi pi-save"
            type="submit"
            className="p-button-success"
            onClick={formik.handleSubmit}
          />
        </div>
      </form>
    </Dialog>
  );
};
