import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Functions from "../../shared/components/comun/Functions";

//primereact
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { TreeSelect } from "primereact/treeselect";
import { useEffect } from "react";
import { Password } from "primereact/password";
import UsuarioService from "../../shared/services/usuarios/UsuarioService";

export const UserForm = ({
  isOpen,
  onClose,
  setUsuarios,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
}) => {
  const [roles, setRoles] = useState(null);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      telefono: "",
      correo: "",
      contrasena: "",
      repetirContrasena: "",
      rol: "",
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
      correo: Yup.string()
        .email("Por favor, ingresa un correo válido.")
        .required("Por favor, ingresa un correo."),
      contrasena: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
          "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial"
        )
        .required("Por favor, ingresa tu contraseña."),
      repetirContrasena: Yup.string()
        .oneOf([Yup.ref("contrasena"), null], "Las contraseñas no coinciden")
        .required("La confirmación de la contraseña es obligatoria"),
      rol: Yup.string().required("Por favor, selecciona un rol."),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const rolEscogido = roles.find((rol) => rol.key === values.rol);
        let objRol = {
          id_rol: rolEscogido.key,
          nombre_rol: rolEscogido.label,
        };
        const {
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          telefono,
          correo,
          contrasena,
          altura,
          peso,
        } = values;
        let usuario = {
          nombre: nombre,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          telefono: telefono,
          correo: correo,
          contrasena: contrasena,
          rol: objRol,
          altura: altura,
          peso: peso,
        };
        console.log(usuario);

        const response = await UsuarioService.create(usuario);
        if (!response.error) {
          setUsuarios((usuarios) => [...usuarios, response.data]);
          formik.resetForm();
          setMensajeAlerta(response.message);
          setMostrarAlerta(true);
          setTipoAlerta("success");
        } else {
          setMensajeAlerta(response.message);
          setMostrarAlerta(true);
          setTipoAlerta("error");
        }
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
    const roles = Functions.roles();
    const userInfo = JSON.parse(localStorage.getItem("user"));
    let rol = userInfo.user.usuario.rol.id_rol;
    rol = parseInt(rol);
    if (rol == 1) {
      setRoles(roles);
    } else {
      let newRoles = [];
      roles.forEach((rol) => {
        if (rol.key != 1 && rol.key != 2) {
          newRoles.push(rol);
        }
      });
      setRoles(newRoles);
    }
    document.title = "Crear Usuario";
    formik.resetForm();
  }, []);

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Dialog
      header="Crear Usuario"
      visible={isOpen}
      style={{ width: "50vw" }}
      onHide={handleClose}
      footer={
        <div>
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
                placeholder="..."
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
                placeholder="..."
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
                placeholder="7772126341"
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
              <label htmlFor="correo">Correo</label>
              <InputText
                id="correo"
                name="correo"
                value={formik.values.correo}
                onChange={formik.handleChange}
                className={
                  formik.errors.correo && formik.touched.correo
                    ? "p-invalid p-d-block"
                    : ""
                }
                placeholder="nombre@ejemplo.com"
              />
              {formik.errors.correo && formik.touched.correo && (
                <small className="p-error">{formik.errors.correo}</small>
              )}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="contrasena">Contraseña</label>
              <Password
                id="contrasena"
                name="contrasena"
                value={formik.values.contrasena}
                onChange={formik.handleChange}
                className={
                  formik.errors.contrasena && formik.touched.contrasena
                    ? "p-invalid p-d-block"
                    : ""
                }
                toggleMask
                feedback={false}
                placeholder="..."
              />
              {formik.errors.contrasena && formik.touched.contrasena && (
                <small className="p-error">{formik.errors.contrasena}</small>
              )}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="repetirContrasena">Repetir Contraseña</label>
              <Password
                id="repetirContrasena"
                name="repetirContrasena"
                value={formik.values.repetirContrasena}
                onChange={formik.handleChange}
                className={
                  formik.errors.repetirContrasena &&
                  formik.touched.repetirContrasena
                    ? "p-invalid p-d-block"
                    : ""
                }
                toggleMask
                feedback={false}
                placeholder="..."
              />
              {formik.errors.repetirContrasena &&
                formik.touched.repetirContrasena && (
                  <small className="p-error">
                    {formik.errors.repetirContrasena}
                  </small>
                )}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="rol">Rol</label>
              <TreeSelect
                id="rol"
                name="rol"
                value={formik.values.rol}
                onChange={formik.handleChange}
                options={roles}
                placeholder="Selecciona un rol"
                className={
                  formik.errors.rol && formik.touched.rol
                    ? "p-invalid p-d-block"
                    : ""
                }
              />
              {formik.errors.rol && formik.touched.rol && (
                <small className="p-error">{formik.errors.rol}</small>
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
                placeholder="...cm"
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
                placeholder="...kg"
              />
              {formik.errors.peso && formik.touched.peso && (
                <small className="p-error">{formik.errors.peso}</small>
              )}
            </div>
          </div>
        </div>
      </form>
    </Dialog>
  );
};
