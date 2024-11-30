import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
//primereact
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";

import { Logo } from "../../shared/components/comun/Logo";
import "../../shared/style/estilos.css";
import { confirmPassword } from "../../shared/services/usuarios/UsuarioService";

export const ConfirmPassword = () => {
  const closeSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rol");
    navigation("/");
    window.location.reload();
  };
  const valuesOfUrl = window.location.href.split("/");
  let token = valuesOfUrl[valuesOfUrl.length - 1];
  token?.includes("token") && (token = token.split("=")[1]);
  console.log(token);
  const [alert, setAlert] = useState(null);
  const navigation = useNavigate();
  const validarSiExisteToken = () => {
    try {
        //si el token contiene confirmar 
    if (token?.includes("confirmar")) {
        navigation("/");
        }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      contrasena: "",
      confirmarContrasena: "",
    },
    validationSchema: Yup.object().shape({
      contrasena: Yup.string()
        .required("Por favor, ingresa tu contraseña.")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
          "1 minúscula/mayúscula/número/carácter especial"
        ),
      confirmarContrasena: Yup.string()
        .oneOf([Yup.ref("contrasena"), null], "Las contraseñas no coinciden")
        .required("La confirmación de la contraseña es obligatoria"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await confirmPassword(token,values.contrasena,values.confirmarContrasena);
        if (response) {
          setAlert(false);
          setTimeout(() => {
            closeSession();
          }, 3000);
        }
      } catch (error) {
        showAlert(error);
      }
      formik.resetForm();
    },
  });

  useEffect(() => {
    validarSiExisteToken();
    document.title = "Reestablecer contraseña";
  }, []);

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small
        className="p-error"
        style={{
          fontWeight: "bold",
          textAlign: "center",
          top: "20px",
          position: "relative",
        }}
      >
        {formik.errors[name]}
      </small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const showAlert = () => {
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 5000);
  };

  return (
    <Card
      className="p-shadow-6"
      style={{
        width: "440px",
        margin: "auto",
        marginTop: "5%",
        borderRadius: "20px",
      }}
    >
      <div
        className="p-d-flex p-jc-center p-ai-center"
        style={{
          backgroundColor: "#179275",
          borderRadius: "20px",
          height: "40%",
          position: "relative",
          overflow: "visible",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            position: "absolute",
            top: "20%",
            textAlign: "center",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Reestablecer contraseña
        </h1>

        <Logo
          style={{
            height: "120px",
            width: "120px",
            position: "absolute",
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
          }}
        />

        <div
          className="p-fluid"
          style={{ padding: "2rem", paddingTop: "8rem" }}
        >
          <form onSubmit={formik.handleSubmit}>
            <div style={{ paddingTop: "20px",marginTop:"50px" }}>
              {alert === true ? (
                <Message
                  severity="error"
                  text="Datos incorrectos o perfil no autorizado."
                />
              ) : alert === false ? (
                <Message severity="success" text="Contraseña actualizada." />
              ) : (
                <Message severity="info" text="Ingresa tu nueva contraseña." />
              )}
            </div>
            <div
              className="p-field"
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                height: "90px",
                width: "101%",
                marginTop: "4rem",
                position: "relative",
              }}
            >
              <label htmlFor="contrasena">
                <h3
                  style={{
                    color: "#102b51",
                    position: "relative",
                    top: "-30px",
                  }}
                >
                  Nueva contraseña
                </h3>
              </label>
              <Password
                id="contrasena"
                name="contrasena"
                feedback={false}
                toggleMask
                value={formik.values.contrasena}
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isFormFieldInvalid("contrasena"),
                })}
                style={{
                  borderRadius: "10px",
                  width: "100%",
                  position: "absolute",
                  top: "0px",
                  height: "70%",
                }}
              />
              {getFormErrorMessage("contrasena")}
            </div>
            <div
              className="p-field"
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                height: "90px",
                width: "101%",
                marginTop: "3rem",
                position: "relative",
              }}
            >
              <label htmlFor="confirmarContrasena">
                <h3
                  style={{
                    color: "#102b51",
                    position: "relative",
                    top: "-30px",
                  }}
                >
                  Confirmar contraseña
                </h3>
              </label>
              <Password
                id="confirmarContrasena"
                name="confirmarContrasena"
                feedback={false}
                toggleMask
                value={formik.values.confirmarContrasena}
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isFormFieldInvalid("confirmarContrasena"),
                })}
                style={{
                  borderRadius: "10px",
                  width: "100%",
                  position: "absolute",
                  top: "0px",
                  height: "70%",
                }}
              />
              {getFormErrorMessage("confirmarContrasena")}
            </div>
            <div
              className="p-d-flex p-jc-center"
              style={{
                marginTop: "2rem",
                marginLeft: "20%",
                marginRight: "10%",
              }}
            >
              <Button
                label="Cambiar contraseña"
                outlined
                style={{
                  width: "80%",
                  backgroundColor: "white",
                  color: "#179275",
                  fontSize: "19px",
                }}
                loading={formik.isSubmitting}
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
};
