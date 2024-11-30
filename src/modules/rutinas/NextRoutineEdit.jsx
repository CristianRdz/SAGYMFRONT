import React from "react";

import * as Yup from "yup";
import { useFormik } from "formik";

//primereact
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import RutinaService from "../../shared/services/rutinas/RutinaService";

export const NextRoutineEdit = ({
  isOpen,
  onClose,
  ejercicios,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
  isBack,
  rutina,
  handleCloseForm,
  setInitialState,
}) => {
  console.log(rutina);
  const checker = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    } else {
      return parseInt(value);
    }
  };
  const formik = useFormik({
    initialValues: {
      ...ejercicios.reduce(
        (acc, ejercicio, index) => ({
          ...acc,
          [`repeticiones-${index}`]: checker(ejercicio.repeticiones),
          [`peso-${index}`]: checker(ejercicio.peso),
        }),
        {}
      ),
    },
    validationSchema: Yup.object().shape({
      ...ejercicios.reduce(
        (acc, ejercicio, index) => ({
          ...acc,
          [`repeticiones-${index}`]: Yup.number()
            .required("Por favor, ingresa las repeticiones.")
            .positive("Por favor, ingresa un número positivo.")
            .integer("Por favor, ingresa un número entero.")
            .min(1, "Por favor, ingresa un número mayor a 0.")
            .max(100, "Por favor, ingresa un número menor a 100."),
        }),
        {}
      ),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const responses = await RutinaService.update(
          rutina,
          values,
          ejercicios
        );
        console.log(responses);
        setMensajeAlerta("Rutina actualizada correctamente.");
        setMostrarAlerta(true);
        setTipoAlerta("success");
        handleCloseForm();
        handleClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleVolver = () => {
    isBack(true);
    handleClose();
    setInitialState(false);
  };

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };
  return (
    <>
      <Dialog
        header="Establecer repeticiones y peso"
        visible={isOpen}
        style={{ width: "50vw", height: "80vh" }}
        modal
        onHide={handleClose}
        footer={
          <div style={{ textAlign: "right", marginTop: "10%" }}>
            <Button
              label="Volver"
              icon="pi pi-arrow-left"
              className="p-button-info"
              type="button"
              onClick={handleVolver}
            />
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-danger"
              type="button"
              onClick={() => {
                handleClose();
                handleCloseForm();
                formik.setFieldValue("ejercicio", []);
              }}
              style={{
                marginLeft: ".25em",
                marginRight: ".25em",
                marginTop: "1em",
              }}
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              type="submit"
              className="p-button-success"
              onClick={formik.handleSubmit}
            />
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit}>
          {ejercicios.map((ejercicio, index) => {
            const exerciseKey = `${ejercicio.ejercicio.nombre}-${index}`;
            return (
              <div className="p-fluid p-formgrid p-grid" key={exerciseKey}>
                <div className="p-field p-col-12 p-md-6">
                  <p style={{ fontWeight: "bold" }}>
                    {ejercicio.ejercicio.nombre}
                  </p>
                  <label htmlFor="repeticiones">Repeticiones</label>
                  <InputText
                    type="number"
                    id={`repeticiones-${index}`}
                    name={`repeticiones-${index}`}
                    value={formik.values[`repeticiones-${index}`]}
                    onChange={formik.handleChange}
                    className={
                      formik.errors[`repeticiones-${index}`] &&
                      formik.touched[`repeticiones-${index}`]
                        ? "p-invalid p-d-block"
                        : ""
                    }
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                    }}
                    placeholder="..."
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                  {formik.errors[`repeticiones-${index}`] &&
                    formik.touched[`repeticiones-${index}`] && (
                      <small className="p-error">
                        {formik.errors[`repeticiones-${index}`]}
                      </small>
                    )}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="peso">Peso</label>
                  <InputText
                    type="number"
                    id={`peso-${index}`}
                    name={`peso-${index}`}
                    value={formik.values[`peso-${index}`]}
                    onChange={formik.handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                    }}
                    placeholder="..."
                  />
                </div>
              </div>
            );
          })}
        </form>
      </Dialog>
    </>
  );
};
