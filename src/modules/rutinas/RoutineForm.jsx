import React, { useState, useEffect } from "react";

import AxiosClient from "../../shared/plugins/axios";
import { useFormik } from "formik";
import * as Yup from "yup";
//componentes
import { NextRoutineForm } from "./NextRoutineForm";
//primereact
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { PickList } from "primereact/picklist";

import Alert, { confirmMsj, confirmTitle } from "../../shared/plugins/alert";
import "../../shared/style/estilos.css";

export const RoutineForm = ({
  isOpen,
  onClose,
  setEjercicio,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
  setisOpen,
  initialState,
  setInitialState,
}) => {
  const [ejercicios, setEjercicios] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [abrirSiguienteModal, setAbrirSiguienteModal] = useState(false);
  const [datosModalAnterior, setDatosModalAnterior] = useState(null);
  const [modalActual, setModalActual] = useState(true);
  const [target, setTarget] = useState([]);
  const formik = useFormik({
    initialValues: {
      nombre: "",
      ejercicio: [],
    },
    validationSchema: Yup.object().shape({
      nombre: Yup.string().required(
        "Por favor, ingresa tu nombre para la rutina."
      ),
      ejercicio: Yup.array().required(
        "Por favor, selecciona al menos un ejercicio."
      ),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        console.log(values);
        abrirSiguienteForm();
        setDatosModalAnterior(values);
        formik.setFieldValue("ejercicio", []);
      } catch (error) {
        setMensajeAlerta(error.message);
        setMostrarAlerta(true);
        setTipoAlerta("error");
        console.log(error);
      }
    },
  });

  const itemTemplate = (item) => {
    return <div>{item.nombre}</div>;
  };

  useEffect(() => {
    getEjercicios();
  }, []);

  const getEjercicios = async () => {
    setisLoading(true);
    try {
      const data = await AxiosClient({
        method: "GET",
        url: "/ejercicio/",
      });
      setEjercicios(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  const onChange = (event) => {
    setEjercicios(event.source);
    setTarget(event.target);
    formik.setFieldValue("ejercicio", event.target);
  };

  const abrirSiguienteForm = () => {
    if (target.length === 0) {
      formik.setFieldError(
        "ejercicio",
        "Por favor, selecciona al menos un ejercicio."
      );
    } else {
      setAbrirSiguienteModal(true);
      setModalActual(false);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
    setTarget([]);
    getEjercicios();
    formik.resetForm();
  };

  const cargar = () => {
    setTarget([]);
    getEjercicios();
    formik.handleReset();
  };

  return (
    <>
      {abrirSiguienteModal && (
        <NextRoutineForm
          formValues={datosModalAnterior}
          isOpen={abrirSiguienteModal}
          onClose={setAbrirSiguienteModal}
          ejercicios={target}
          isBack={setisOpen}
          setMensajeAlerta={setMensajeAlerta}
          setMostrarAlerta={setMostrarAlerta}
          setTipoAlerta={setTipoAlerta}
          handleCloseForm={handleClose}
          setInitialState={setInitialState}
        />
      )}
      <Dialog
        header="Crear Rutina"
        visible={isOpen}
        onShow={() => {
          if (initialState === true) {
            cargar();
          }
        }}
        style={{ width: "50vw" }}
        onHide={handleClose}
        modal
        footer={
          <div style={{ textAlign: "right", marginTop: "5%" }}>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-danger"
              type="button"
              onClick={() => {
                handleClose();
                formik.setFieldValue("ejercicio", []);
              }}
              style={{
                marginLeft: ".25em",
                marginRight: ".25em",
                marginTop: "1em",
              }}
            />
            <Button
              label="Siguiente"
              icon="pi pi-arrow-right"
              type="submit"
              className="p-button-info"
              onClick={formik.handleSubmit}
            />
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit}>
          <div>
            <div className="p-fluid p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="nombre">Nombre de la rutina</label>
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
                <div
                  style={{
                    marginTop: "2%",
                  }}
                >
                  <PickList
                    source={ejercicios}
                    target={target}
                    filter 
                    filterBy="nombre"
                    sourceFilterPlaceholder="Buscar por nombre"
                    targetFilterPlaceholder="Buscar por nombre"
                    onChange={onChange}
                    itemTemplate={itemTemplate}
                    breakpoint="100%"
                    sourceHeader="Ejercicios"
                    targetHeader="Seleccionados"
                    sourceStyle={{ height: "100%" }}
                    targetStyle={{ height: "100%" }}
                    showSourceControls={false}
                    showTargetControls={false}
                    className={
                      formik.errors.ejercicio && formik.touched.ejercicio
                        ? "p-invalid p-d-block"
                        : ""
                    }
                  />
                  <div
                    style={{
                      position: "relative",
                      buttom: "0",
                      marginTop: "9%",
                    }}
                  >
                    {formik.errors.ejercicio && formik.touched.ejercicio && (
                      <small className="p-error">
                        {formik.errors.ejercicio}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </form>
      </Dialog>
    </>
  );
};
