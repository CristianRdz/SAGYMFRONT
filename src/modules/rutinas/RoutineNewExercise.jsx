import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

//primereact
import { Dialog } from "primereact/dialog";
import { PickList } from "primereact/picklist";
import EjerciciosService from "../../shared/services/ejercicios/EjerciciosService";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "primereact/button";
import { NextRoutineForm } from "./NextRoutineForm";
import RutinaService from "../../shared/services/rutinas/RutinaService";
import { NextRoutineEdit } from "./NextRoutineEdit";
import Alert, {
  confirmMsj,
  confirmTitle,
  errorTitle,
} from "../../shared/plugins/alert";
export const RoutineNewExercise = ({
  isOpen,
  onClose,
  setRutina,
  rutina,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
  setisOpen,
  initialState,
  setInitialState,
  ejercicios,
  setEjercicios,
}) => {
  const [isLoading, setisLoading] = useState(false);
  const [target, setTarget] = useState([]);
  const [abrirSiguienteModal, setAbrirSiguienteModal] = useState(false);
  const [modalActual, setModalActual] = useState(true);
  const [datosModalAnterior, setDatosModalAnterior] = useState(null);
  const [todosEjercicios, setTodosEjercicios] = useState([]);
  const formik = useFormik({
    initialValues: {
      ejercicio: null,
    },
    validationSchema: Yup.object().shape({
      // size > 0
      ejercicio: Yup.array()
        .min(1, "Por favor, selecciona al menos un ejercicio.")
        .required("Por favor, selecciona al menos un ejercicio."),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        abrirSiguienteForm();
        setInitialState(false);
        setDatosModalAnterior(values);
        formik.setFieldValue("ejercicio", []);
      } catch (error) {
        console.log(error);
      }
    },
  });
  useEffect(() => {
    getEjercicios();
  }, []);

  const getEjercicios = async () => {
    try {
      let response = await EjerciciosService.getAll();
      let ejerciciosActuales = response.data;
      let NuevosEjercicios = [];
      console.log("Todos los ejercicios: ", ejerciciosActuales);
      console.log("Ejercicios seleccionados: ", ejercicios);
      ejerciciosActuales.forEach((ejercicio) => {
        let encontrado = false;
        ejercicios.forEach((ejercicioSeleccionado) => {
          if (
            ejercicio.id_ejercicio ===
            ejercicioSeleccionado.ejercicio.id_ejercicio
          ) {
            encontrado = true;
          }
        });
        if (!encontrado) {
          NuevosEjercicios.push({
            id_asignacion: null,
            ejercicio: ejercicio,
            repeticiones: "",
            peso: "",
          });
        }
      });

      setTodosEjercicios(NuevosEjercicios);
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (event) => {
    setTarget(event.target);
    setTodosEjercicios(event.source);
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

  React.useMemo(() => {
    setTarget(ejercicios);
  }, [ejercicios]);

  const itemTemplate = (item) => {
    if (item.id_asignacion == null) {
      return <div>{item.ejercicio.nombre}</div>;
    } else {
      return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {item.ejercicio.nombre}
          <Button
            icon="pi pi-trash"
            className="p-button-danger"
            type="reset"
            onClick={async () => {
              Alert.fire({
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
                    await RutinaService.eliminarEjercicio(item.id_asignacion);
                    await RutinaService.recalcular(rutina);
                    setAbrirSiguienteModal(false);
                    setModalActual(false);
                    handleClose();
                    setMensajeAlerta("Ejercicio eliminado correctamente.");
                    setMostrarAlerta(true);
                    setTipoAlerta("success");
                  } catch (error) {
                    Alert.error(errorTitle);
                  }
                },
              });
            }}
          />
        </div>
      );
    }
  };

  const targetItemTemplate = (item) => {
    if (item.id_asignacion == null) {
      return <div>{item.ejercicio.nombre}</div>;
    } else {
      return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {item.ejercicio.nombre}
          <Button
            icon="pi pi-trash"
            className="p-button-danger"
            type="reset"
            onClick={async () => {
              Alert.fire({
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
                    await RutinaService.eliminarEjercicio(item.id_asignacion);
                    await RutinaService.recalcular(rutina);
                    setAbrirSiguienteModal(false);
                    setModalActual(false);
                    handleClose();
                    setMensajeAlerta("Ejercicio eliminado correctamente.");
                    setMostrarAlerta(true);
                    setTipoAlerta("success");
                  } catch (error) {
                    Alert.error(errorTitle);
                  }
                },
              });
            }}
          />
        </div>
      );
    }
  };

  const handleClose = () => {
    setInitialState(true);
    setTarget([]);
    setEjercicios([]);
    setTodosEjercicios([]);
    setInitialState(true);
    formik.resetForm();
    onClose();
  };
  return (
    <>
      {abrirSiguienteModal && (
        <NextRoutineEdit
          setMensajeAlerta={setMensajeAlerta}
          setMostrarAlerta={setMostrarAlerta}
          setTipoAlerta={setTipoAlerta}
          rutina={rutina}
          isOpen={abrirSiguienteModal}
          onClose={setAbrirSiguienteModal}
          ejercicios={target}
          isBack={setisOpen}
          handleCloseForm={handleClose}
          setInitialState={setInitialState}
        />
      )}
      <Dialog
        header="Agregar Ejercicios"
        visible={isOpen}
        style={{ width: "50vw" }}
        onShow={async () => {
          if (initialState) {
            setTodosEjercicios([]);
            formik.setFieldValue("ejercicio", target);
            await getEjercicios();
          }
        }}
        onHide={handleClose}
        footer={
          <div style={{ textAlign: "right", marginTop: "5%" }}>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-danger"
              type="button"
              onClick={() => {
                handleClose();
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
          <div className="p-field p-col-12 p-md-6">
            <div
              style={{
                marginTop: "2%",
              }}
            >
              <PickList
                filter
                filterBy="ejercicio.nombre"
                sourceFilterPlaceholder="Buscar por nombre"
                targetFilterPlaceholder="Buscar por nombre"
                source={todosEjercicios}
                target={target}
                onChange={onChange}
                itemTemplate={itemTemplate}
                targetItemTemplate={targetItemTemplate}
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
                  <small
                    className="p-error"
                    style={{
                      position: "absolute",
                      marginTop: "2%",
                    }}
                  >
                    {formik.errors.ejercicio}
                  </small>
                )}
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};
