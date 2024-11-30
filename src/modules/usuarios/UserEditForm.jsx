import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AxiosClient from "../../shared/plugins/axios";

//primereact
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import Alert, { confirmMsj, confirmTitle } from "../../shared/plugins/alert";
import "../../shared/style/estilos.css";
import UsuarioService from "../../shared/services/usuarios/UsuarioService";

export const UserEditForm = ({
  isOpen,
  onClose,
  setUsuarios,
  usuario,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
}) => {
  const usuarioActual = JSON.parse(localStorage.getItem("user"));
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      telefono: "",
      altura: "",
      peso: "",
    },
    validationSchema: Yup.object().shape({
      nombre: Yup.string().required("Por favor, ingresa tu nombre."),
      apellidoPaterno: Yup.string().required(
        "Por favor, ingresa tu apellido paterno."
      ),
      apellidoMaterno: Yup.string().required(
        "Por favor, ingresa tu apellido materno."
      ),
      telefono: Yup.string()
        .min(10, "El teléfono debe tener 10 dígitos.")
        .max(10, "El teléfono debe tener 10 dígitos.")
        .required("Por favor, ingresa tu teléfono."),
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
          try {
            console.log(values);
            let {
              id_usuario,
              nombre,
              apellidoPaterno,
              apellidoMaterno,
              telefono,
              altura,
              peso,
            } = values;

            const usuarioN = {
              id_usuario,
              nombre,
              apellido_paterno: apellidoPaterno,
              apellido_materno: apellidoMaterno,
              telefono,
              altura: altura ? altura : 0,
              peso: peso ? peso : 0,
            };

            console.log(usuarioN);
            const response = await UsuarioService.update(usuarioN);
            if (!response.error) {
              setUsuarios((usuarios) => {
                const newUsuarios = usuarios.map((usuario) => {
                  if (usuario.id_usuario === id_usuario) {
                    return {
                      ...usuario,
                      nombre: nombre,
                      apellido_paterno: apellidoPaterno,
                      apellido_materno: apellidoMaterno,
                      telefono: telefono,
                      altura: altura,
                      peso: peso,
                    };
                  }
                  return usuario;
                });
                return newUsuarios;
              });
              if (
                usuarioActual.user.usuario.id_usuario === usuarioN.id_usuario
              ) {
                usuarioActual.user.usuario.nombre = usuarioN.nombre;
                usuarioActual.user.usuario.apellido_paterno =
                  usuarioN.apellido_paterno;
                usuarioActual.user.usuario.apellido_materno =
                  usuarioN.apellido_materno;
                usuarioActual.user.usuario.telefono = usuarioN.telefono;
                usuarioActual.user.usuario.altura = usuarioN.altura;
                usuarioActual.user.usuario.peso = usuarioN.peso;
                localStorage.setItem("user", JSON.stringify(usuarioActual));
              }
              setMensajeAlerta(response.message);
              setMostrarAlerta(true);
              setTipoAlerta("success");
              handleClose();
            } else {
              setMensajeAlerta(response.message);
              setMostrarAlerta(true);
              setTipoAlerta("error");
              onClose();
            }
          } catch (error) {
            setMensajeAlerta(error.message);
            setMostrarAlerta(true);
            setTipoAlerta("error");
            onClose();
            console.log(error);
          }
        },
      });
    },
  });

  React.useMemo(() => {
    const {
      id_usuario,
      nombre,
      apellido_materno,
      apellido_paterno,
      telefono,
      altura,
      peso,
    } = usuario;
    formik.values.id_usuario = id_usuario;
    formik.values.nombre = nombre;
    formik.values.apellidoPaterno = apellido_paterno;
    formik.values.apellidoMaterno = apellido_materno;
    formik.values.telefono = telefono;
    formik.values.altura = altura ? altura : "";
    formik.values.peso = peso ? peso : "";
  }, [usuario]);

  useEffect(() => {
    document.title = "Editar Usuario";
  }, []);

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Dialog
      header="Actualizar Usuario"
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
              <label htmlFor="apellidoPaterno">Apellido Paterno</label>
              <InputText
                id="apellidoPaterno"
                name="apellidoPaterno"
                value={formik.values.apellidoPaterno}
                onChange={formik.handleChange}
                className={
                  formik.errors.apellidoPaterno &&
                  formik.touched.apellidoPaterno
                    ? "p-invalid p-d-block"
                    : ""
                }
                style={{
                  width: "100%",
                  borderRadius: "10px",
                }}
              />
              {formik.errors.apellidoPaterno &&
                formik.touched.apellidoPaterno && (
                  <small className="p-error">
                    {formik.errors.apellidoPaterno}
                  </small>
                )}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="apellidoMaterno">Apellido Materno</label>
              <InputText
                id="apellidoMaterno"
                name="apellidoMaterno"
                value={formik.values.apellidoMaterno}
                onChange={formik.handleChange}
                className={
                  formik.errors.apellidoMaterno &&
                  formik.touched.apellidoMaterno
                    ? "p-invalid p-d-block"
                    : ""
                }
              />
              {formik.errors.apellidoMaterno &&
                formik.touched.apellidoMaterno && (
                  <small className="p-error">
                    {formik.errors.apellidoMaterno}
                  </small>
                )}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="telefono">Teléfono</label>
              <InputText
                id="telefono"
                name="telefono"
                value={formik.values.telefono}
                onChange={formik.handleChange}
                className={
                  formik.errors.telefono && formik.touched.telefono
                    ? "p-invalid p-d-block"
                    : ""
                }
                maxLength={10}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
              />
              {formik.errors.telefono && formik.touched.telefono && (
                <small className="p-error">{formik.errors.telefono}</small>
              )}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="altura">Altura</label>
              <InputText
                id="altura"
                name="altura"
                value={formik.values.altura}
                onChange={formik.handleChange}
                className={
                  formik.errors.altura && formik.touched.altura
                    ? "p-invalid"
                    : ""
                }
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
              />
              {formik.errors.altura && formik.touched.altura && (
                <small className="p-error">{formik.errors.altura}</small>
              )}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="peso">Peso</label>
              <InputText
                id="peso"
                name="peso"
                value={formik.values.peso}
                onChange={formik.handleChange}
                className={
                  formik.errors.peso && formik.touched.peso ? "p-invalid" : ""
                }
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
              />
              {formik.errors.peso && formik.touched.peso && (
                <small className="p-error">{formik.errors.peso}</small>
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
