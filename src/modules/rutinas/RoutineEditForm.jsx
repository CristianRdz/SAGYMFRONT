import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

//primereact
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import RutinaService from "../../shared/services/rutinas/RutinaService";

export const RoutineEditForm = ({
  isOpen,
  onClose,
  rutina,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
}) => {
  const formik = useFormik({
    initialValues: {
      nombre: "",
    },
    validationSchema: Yup.object().shape({
      nombre: Yup.string().required("Por favor, ingresa un nombre."),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let rutinaTemp = rutina;
        rutinaTemp.nombre_rutina = values.nombre;
        const response = await RutinaService.updateRutina(rutinaTemp);
        setMensajeAlerta("Rutina actualizada correctamente.");
        setMostrarAlerta(true);
        setTipoAlerta("success");
        onClose();
      } catch (error) {
        setMensajeAlerta(error.message);
        setMostrarAlerta(true);
        setTipoAlerta("error");
        console.log(error);
      }
    },
  });

  React.useMemo(() => {
    const { nombre_rutina } = rutina;
    formik.values.nombre = nombre_rutina;
  }, [rutina]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      header="Editar Rutina"
      visible={isOpen}
      style={{ width: "50vw" }}
      onHide={onClose}
      footer={
        <div>
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
      }
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
          </div>
        </div>
      </form>
    </Dialog>
  );
};
