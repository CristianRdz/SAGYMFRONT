import React, { useState } from "react";

import * as Yup from "yup";
import { useFormik } from "formik";

//primereact
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { changePassword } from "../../shared/services/usuarios/UsuarioService";
import { useNavigate } from "react-router-dom";
export const ChangePassword = ({
  isOpen,
  onClose,
  setUsuario,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta,
}) => {
  const navigation = useNavigate();
  const closeSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rol");
    navigation("/");
    window.location.reload();
  };
  const formik = useFormik({
    initialValues: {
      contasenaActual: "",
      nuevaContrasena: "",
      repetirContrasena: "",
    },
    validationSchema: Yup.object().shape({
      contasenaActual: Yup.string().required(
        "Por favor, ingresa tu contraseña actual."
      ),
      nuevaContrasena: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
          "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial"
        )
        .required("Por favor, ingresa tu contraseña."),
      repetirContrasena: Yup.string()
        .oneOf(
          [Yup.ref("nuevaContrasena"), null],
          "Las contraseñas no coinciden"
        )
        .required("La confirmación de la contraseña es obligatoria"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await changePassword(
          values.contasenaActual,
          values.nuevaContrasena
        );
        if (response) {
          handleClose();
          setMensajeAlerta("Contraseña cambiada correctamente");
          setMostrarAlerta(true);
          setTipoAlerta("success");
          setTimeout(() => {
            closeSession();
          }, 2000);
        } else {
          handleClose();
          setMensajeAlerta("No se pudo cambiar la contraseña");
          setMostrarAlerta(true);
          setTipoAlerta("error");
        }
      } catch (error) {
        handleClose();
        setMensajeAlerta("No se pudo cambiar la contraseña");
        setMostrarAlerta(true);
        setTipoAlerta("error");
      }
    },
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };
  return (
    <Dialog
      header="Cambiar contraseña"
      visible={isOpen}
      style={{ width: "50vw" }}
      onHide={handleClose}
      footer={
        <div style={{ display: "flex", justifyContent:  "flex-end" }}>
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
            loading={formik.isSubmitting}
            onClick={formik.handleSubmit}
          />
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="contasenaActual">Contraseña Actual</label>
            <Password
              id="contasenaActual"
              name="contasenaActual"
              value={formik.values.contasenaActual}
              onChange={formik.handleChange}
              className={
                formik.errors.contasenaActual && formik.touched.contasenaActual
                  ? "p-invalid p-d-block"
                  : ""
              }
              toggleMask
              feedback={false}
              placeholder="..."
            />
            {formik.errors.contasenaActual &&
              formik.touched.contasenaActual && (
                <small className="p-error">
                  {formik.errors.contasenaActual}
                </small>
              )}
          </div>
          <div className="p-field p-col-12 p-md-6">
            <label htmlFor="nuevaContrasena">Contraseña Nueva</label>
            <Password
              id="nuevaContrasena"
              name="nuevaContrasena"
              value={formik.values.nuevaContrasena}
              onChange={formik.handleChange}
              className={
                formik.errors.nuevaContrasena && formik.touched.nuevaContrasena
                  ? "p-invalid p-d-block"
                  : ""
              }
              toggleMask
              feedback={false}
              placeholder="..."
            />
            {formik.errors.nuevaContrasena &&
              formik.touched.nuevaContrasena && (
                <small className="p-error">
                  {formik.errors.nuevaContrasena}
                </small>
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
        </div>
      </form>
    </Dialog>
  );
};
