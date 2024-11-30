import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import UsuarioService from "../../shared/services/usuarios/UsuarioService";
import RutinaService from "../../shared/services/rutinas/RutinaService";

//primereact
import { ListBox } from "primereact/listbox";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

export const RoutineAssign = ({
  isOpen,
  onClose,
  setRutinas,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
}) => {
  const [rutinasA, setRutinasA] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const formik = useFormik({
    initialValues: {
      usuario: null,
      rutina: null,
      dias_meta: 0,
    },
    validationSchema: Yup.object().shape({
      usuario: Yup.object().required("Por favor, selecciona un usuario."),
      rutina: Yup.object().required("Por favor, selecciona una rutina."),
      // numero positivo menor a 100
      dias_meta: Yup.number()
        .required("Por favor, ingresa un número de días.")
        .positive("Por favor, ingresa un número positivo.")
        .integer("Por favor, ingresa un número entero.")
        .max(100, "Por favor, ingresa un número menor a 100."),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const id_usuario = values.usuario.id_usuario;
        const id_rutina = values.rutina.id_rutina;
        const dias_meta = values.dias_meta;
        ///asignarRutina/{id_rutina}/{id_usuario}/{dias_meta}
        await RutinaService.asignarRutina(id_rutina, id_usuario, dias_meta);
        setMensajeAlerta("Rutina asignada correctamente.");
        setMostrarAlerta(true);
        setTipoAlerta("success");
        handleClose();
      } catch (error) {
        setMensajeAlerta(error.message);
        setMostrarAlerta(true);
        setTipoAlerta("error");
        console.log(error);
      }
    },
  });
  async function fetchData() {
    try {
      const usuariosGym = await UsuarioService.getAllByRol("3");
      setUsuarios(usuariosGym.data);
      const rutinasSinAsignar = await RutinaService.getRutinasSinAsignar();
      setRutinasA(rutinasSinAsignar.data);
    } catch (error) {
      setMensajeAlerta(error.message);
      setMostrarAlerta(true);
      setTipoAlerta("error");
      console.log(error);
      handleClose();
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const usuariosTemp = (item) => {
    return (
      <div>
        {item.nombre} {item.apellido_paterno} {item.apellido_materno}
      </div>
    );
  };
  const rutinasTemp = (item) => {
    return <div>{item.nombre_rutina}</div>;
  };

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Dialog
      header="Asignar Rutina"
      visible={isOpen}
      maximizable={true}
      style={{ width: "70vw", height: "100vh" }}
      modal
      onShow={async () => {
        formik.resetForm();
        await fetchData();
      }}
      onHide={() => onClose()}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button
            label="Limpiar"
            icon="pi pi-eraser"
            className="p-button-info"
            type="button"
            onClick={() => {
              formik.setFieldValue("usuario", {});
              formik.setFieldValue("rutina", {});
              formik.resetForm();
            }}
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
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              marginRight: "10px",
              display: "inline-block",
              width: "50%",
              height: "100%",
              backgroundColor: "#F5F5F5",
              borderRadius: "5px",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          >
            <h3
              style={{
                color: "#333",
                margin: "0 0 5px",
                fontSize: "1.2rem",
                textAlign: "center",
              }}
            >
              Usuarios
            </h3>
            <ListBox
              filter
              filterBy="nombre,apellido_paterno,apellido_materno,correo,telefono"
              filterPlaceholder="Buscar por nombre, correo o teléfono"
              style={{ backgroundColor: "#fff", border: "none" }}
              value={formik.values.usuario}
              id="usuario"
              name="usuario"
              options={usuarios}
              onChange={(e) => {
                formik.setFieldValue("usuario", e.value);
                formik.handleChange(e);
              }}
              itemTemplate={usuariosTemp}
              header="Usuarios"
              className={
                formik.errors.usuario && formik.touched.usuario
                  ? "p-invalid"
                  : ""
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {formik.errors.usuario && formik.touched.usuario && (
                <small className="p-invalid">{formik.errors.usuario}</small>
              )}
            </div>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "50%",
              height: "100%",
              backgroundColor: "#F5F5F5",
              borderRadius: "5px",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          >
            <h3
              style={{
                color: "#333",
                margin: "0 0 5px",
                fontSize: "1.2rem",
                textAlign: "center",
              }}
            >
              Rutinas
            </h3>
            <ListBox
              filter
              filterBy="nombre_rutina"
              filterPlaceholder="Buscar por nombre de rutina"
              value={formik.values.rutina}
              options={rutinasA}
              onChange={(e) => formik.setFieldValue("rutina", e.value)}
              itemTemplate={rutinasTemp}
              header="Rutinas"
              style={{ backgroundColor: "#fff", border: "none" }}
              className={
                formik.errors.rutina && formik.touched.rutina ? "p-invalid" : ""
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {formik.errors.rutina && formik.touched.rutina && (
                <small className="p-invalid">{formik.errors.rutina}</small>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <i className="pi pi-calendar"></i>
            <span>Dias Meta</span>
          </div>
          <div className="card-content">
            <InputText
              id="dias_meta"
              name="dias_meta"
              type="number"
              value={formik.values.dias_meta}
              onChange={formik.handleChange}
              className={
                formik.errors.dias_meta && formik.touched.dias_meta
                  ? "p-invalid"
                  : ""
              }
              placeholder="Dias Meta"
            />
            {formik.errors.dias_meta && formik.touched.dias_meta && (
              <small className="p-invalid">{formik.errors.dias_meta}</small>
            )}
          </div>
        </div>
      </form>
    </Dialog>
  );
};
