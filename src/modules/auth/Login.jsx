import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { AuthContext } from "./authContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import UsuarioService from "../../shared/services/usuarios/UsuarioService";
//primereact
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";

import { Logo } from "../../shared/components/comun/Logo";
import "../../shared/style/estilos.css";

export const Login = () => {
  const [alert, setAlert] = useState(false);
  const navigation = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      correo: "",
      contrasena: "",
    },
    validationSchema: Yup.object().shape({
      correo: Yup.string()
        .email("Por favor, ingresa un correo válido.")
        .required("Por favor, ingresa un correo."),
      contrasena: Yup.string().required("Por favor, ingresa tu contraseña."),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await UsuarioService.login(values);
        const rol = response.data.user.usuario.rol.id_rol;
        if (rol !== 3 && !response.error) {
            const action = {
              type: "LOGIN",
              payload: response.data,
            };
            dispatch(action);
            navigation("/", { replace: true });
          } else {
          showAlert();
        }
      } catch (error) {
        showAlert(error);
      }
      formik.resetForm();
    },
  });

  useEffect(() => {
    document.title = "Login";
  }, []);

  if (user.isLogged) {
    return <Navigate to="/" />;
  }

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
            top: "15%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Bienvenido
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
            <div style={{ paddingTop: "20px" }}>
              {alert === true ? (
                <Message severity="error" text="Datos incorrectos o perfil no autorizado." />
              ) : (
                <div></div>
              )}
            </div>

            <div
              className="p-field "
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                height: "90px",
                width: "101%",
                position: "relative",
                marginTop: "2rem",
              }}
            >
              <label htmlFor="correo">
                <h3
                  style={{
                    color: "#102b51",
                    position: "relative",
                    top: "-30px",
                  }}
                >
                  Correo
                </h3>
              </label>
              <InputText
                id="correo"
                onChange={formik.handleChange}
                value={formik.values.correo}
                className={classNames({
                  "p-invalid": isFormFieldInvalid("correo"),
                })}
                style={{
                  borderRadius: "10px",
                  width: "100%",
                  position: "absolute",
                  top: "0px",
                  height: "70%",
                }}
              />
              {getFormErrorMessage("correo")}
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
              <label htmlFor="contrasena">
                <h3
                  style={{
                    color: "#102b51",
                    position: "relative",
                    top: "-30px",
                  }}
                >
                  Contraseña
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
              className="p-d-flex p-jc-center"
              style={{
                marginTop: "2rem",
                marginLeft: "20%",
                marginRight: "10%",
              }}
            >
              <Button
                label="Ingresar"
                outlined
                style={{
                  width: "80%",
                  backgroundColor: "white",
                  color: "#179275",
                  fontSize: "19px",
                }}
                type="submit"
              />
            </div>
          </form>

          <div
            className="p-d-flex p-jc-center"
            style={{
              marginTop: "2rem",
              marginLeft: "10%",
              marginRight: "10%",
            }}
          >
            <Button
              label="¿Olvidaste tu contraseña?"
              style={{
                backgroundColor: "#102b51",
                color: "white",
                fontSize: "18px",
              }}
              onClick={() => navigation("/recuperar")}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
