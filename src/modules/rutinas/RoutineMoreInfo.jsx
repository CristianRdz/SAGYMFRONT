import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
//primereact
import { Dialog } from "primereact/dialog";
import "../../shared/style/estilos.css";
import { ListBox } from "primereact/listbox";
import { Button } from "primereact/button";
import RutinaService from "../../shared/services/rutinas/RutinaService";
import Alert, {
  confirmMsj,
  confirmTitle,
  errorTitle,
} from "../../shared/plugins/alert";
import { InputText } from "primereact/inputtext";

export const RoutineMoreInfo = ({
  isOpen,
  onClose,
  setRutina,
  rutina,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
  ejercicios,
  setEjercicios,
}) => {
  const handleClose = () => {
    formik.resetForm();
    setDiasMeta(0);
    setEjercicios([]);
    setEjercicioSeleccionado(null);
    setProgreso(null);
    onClose();
  };

  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [diasMeta, setDiasMeta] = useState(0);
  const [diasAvance, setDiasAvance] = useState(0);

  async function fetchData() {
    if (rutina.id_rutina) {
      const response = await RutinaService.getProgresos(rutina.id_rutina);
      setProgreso(response.data[0]);
      if (response.data[0]) {
        formik.setFieldValue("dias_meta", response.data[0].dias_meta);
        setDiasMeta(response.data[0].dias_meta);
        setDiasAvance(response.data[0].dias_avance);
      }
    }
  }
  const formik = useFormik({
    initialValues: {
      dias_meta: 0,
    },
    validationSchema: Yup.object().shape({
      dias_meta: Yup.number()
        .required("Por favor, ingresa un número de días.")
        .positive("Por favor, ingresa un número positivo.")
        .integer("Por favor, ingresa un número entero.")
        //tiene que ser mayor a los dias que ya se han avanzado + 1
        .min(
          diasAvance + 1,
          "Por favor, ingresa un número mayor a " + diasAvance
        )
        .max(100, "Por favor, ingresa un número menor a 100."),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
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
              let progresoTemp = progreso;
              progresoTemp.dias_meta = values.dias_meta;
              const response = await RutinaService.updateProgreso(progresoTemp);
              if (!response.error) {
                setMensajeAlerta("Se actualizó el progreso correctamente");
                setMostrarAlerta(true);
                setTipoAlerta("success");
              } else {
                setMensajeAlerta("No se ha podido actualizar el progreso");
                setMostrarAlerta(true);
                setTipoAlerta("error");
              }
              handleClose();
            } catch (error) {}
          },
        });
      } catch (error) {}
    },
  });

  const handleDelete = async () => {
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
          const response = await RutinaService.deleteProgreso(
            progreso.id_progreso
          );
          if (!response.error) {
            setMensajeAlerta("Se ha desasignado la rutina correctamente");
            setMostrarAlerta(true);
            setTipoAlerta("success");
          } else {
            setMensajeAlerta("No se ha podido desasignar la rutina");
            setMostrarAlerta(true);
            setTipoAlerta("error");
          }
          handleClose();
        } catch (error) {
          Alert.error(errorTitle);
        }
      },
    });
  };

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  return (
    <Dialog
      maximizable
      header="Ejercicios Asignados y Progreso"
      visible={isOpen}
      onShow={async () => {
        setProgreso(null);
        setDiasMeta(null);
        await fetchData();
      }}
      style={{ width: "70vw", height: "90vh" }}
      onHide={handleClose}
    >
      <div className="p-grid p-fluid">
        <ListBox
          options={ejercicios}
          multiple
          onChange={(e) => setEjercicioSeleccionado(e.value)}
          itemTemplate={(item) => (
            <div className="p-clearfix">
              <div style={{ fontSize: "1.2em", float: "left", margin: 10 }}>
                {item.ejercicio.nombre} - {item.repeticiones} Repeticiones -{" "}
                {item.peso ? item.peso : "Sin peso"}
              </div>
            </div>
          )}
          filter
          filterPlaceholder="Buscar"
          filterBy="ejercicio.nombre, ejercicio.descripcion, ejercicio.id_asignacion"
        />
      </div>
      {progreso ? (
        <div className="progress-container">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Progreso rutina: {progreso.rutina.nombre_rutina}</h2>
            <Button
              label="Desasignar rutina"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={handleDelete}
            />
          </div>

          <div className="card">
            <div className="card-title">
              <i className="pi pi-user"></i>
              <span>Usuario asignado</span>
            </div>
            <div className="card-content">
              {progreso.usuario.nombre} {progreso.usuario.apellido_paterno}{" "}
              {progreso.usuario.apellido_materno}
            </div>
          </div>
          <div className="progress-details">
            <div className="card">
              <div className="card-title">
                <i className="pi pi-history"></i>
                <span>Progreso del dia</span>
              </div>
              <div className="card-content">
                <div className="progress-item">
                  <span>
                    Repeticiones {progreso.progreso_dia} de {progreso.meta_dia}
                  </span>
                  <h3>Ejercicios del dia</h3>
                  <span>{progreso.porcentaje_dia.toFixed(2)}% completado </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">
                <i className="pi pi-history"></i>
                <span>Progreso general</span>
              </div>
              <div className="card-content">
                <div className="progress-item">
                  <span>
                    {progreso.dias_avance} de {progreso.dias_meta} días
                    completados
                  </span>
                  <h3>Porcentaje de avance</h3>
                  {/* dias_avance entre dias meta por 100 fixeado a 2 decimales */}
                  <span>
                    {(
                      (progreso.dias_avance / progreso.dias_meta) *
                      100
                    ).toFixed(2)}
                    % completado{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-title">
              <i className="pi pi-file-o"></i>
              <span>Anotaciones</span>
            </div>
            <div className="card-content">
              <div className="anotaciones">
                {progreso.anotaciones
                  ? isNaN(progreso.anotaciones)
                    ? progreso.anotaciones
                    : "Sin anotaciones"
                  : "Sin anotaciones"}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-title">
              <i className="pi pi-calendar"></i>
              <span>Cambiar dias meta</span>
            </div>
            <div className="card-content">
              <div className="progress-item">
                <InputText
                  id="dias_meta"
                  name="dias_meta"
                  type="number"
                  value={formik.values.dias_meta}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.dias_meta && formik.touched.dias_meta
                      ? "p-invalid"
                      : ""
                  }
                />
                {formik.errors.dias_meta && formik.touched.dias_meta && (
                  <small className="p-error">{formik.errors.dias_meta}</small>
                )}
                <Button
                  className="p-button-success"
                  style={{ marginTop: "1em" }}
                  type="submit"
                  label="Cambiar"
                  icon="pi pi-check"
                  onClick={formik.handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="progress-container">
          <h2>No hay progreso para esta rutina</h2>
        </div>
      )}
    </Dialog>
  );
};
