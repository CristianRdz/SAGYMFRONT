import React, { useEffect } from "react";
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

export const ExerciseEditForm = ({
  isOpen,
  onClose,
  setEjercicio,
  ejercicio,
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
      nombre: Yup.string().required("Por favor, ingresa tu nombre."),
    }),
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
          setisLoading(true);
          try {
            const response = await EjerciciosService.update(
              values.id_ejercicio,
              values.nombre,
              values.descripcion
            );
            setisLoading(false);
            setMensajeAlerta("Ejercicio actualizado correctamente.");
            setTipoAlerta("success");
            setMostrarAlerta(true);
            onClose();
            formik.resetForm();
          } catch (error) {
            setisLoading(false);
            setMensajeAlerta(error.response.data.mensaje);
            setTipoAlerta("error");
            setMostrarAlerta(true);
            setisLoading(false);
          }
        },
      });
    },
  });

  React.useMemo(() => {
    const { id_ejercicio, nombre, descripcion } = ejercicio;
    formik.values.id_ejercicio = id_ejercicio;
    formik.values.nombre = nombre;
    formik.values.descripcion = descripcion;
  }, [ejercicio]);

  useEffect(() => {
    document.title = "Actualizar Ejercicio";
  }, []);

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Dialog
      header="Actualizar Ejercicio"
      visible={isOpen}
      style={{ width: "50vw" }}
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
            label="Actualizar"
            icon="pi pi-check"
            type="submit"
            className="p-button-warning"
            onClick={formik.handleSubmit}
          />
        </div>
      </form>
    </Dialog>
  );
};
