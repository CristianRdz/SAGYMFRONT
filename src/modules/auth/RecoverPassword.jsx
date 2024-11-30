import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

//primereact
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
// importamos recoverPassword
import { recoverPassword } from "../../shared/services/usuarios/UsuarioService";



import { Logo } from "../../shared/components/comun/Logo";


export const RecoverPassword = () => {
  const navigation = useNavigate();
  const [buton, setButon] = useState(null);
  const formik = useFormik({
    initialValues: {
      correo: "",
    },
    validationSchema: Yup.object().shape({
      correo: Yup.string()
        .email("Por favor, ingresa un correo válido.")
        .required("Por favor, ingresa un correo."),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      const response = await recoverPassword(values.correo);
      if (response) {
        setButon(true);
      }else{
        setButon(false);
      }
    },
  });

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

  return (
    <Card
      className="p-shadow-6"
      style={{
        width: "25%",
        margin: "auto",
        marginTop: "7%",
        borderRadius: "20px",
      }}
    >
      <div
        className="p-d-flex p-jc-center p-ai-center"
        style={{
          backgroundColor: "#179275",
          borderRadius: "20px",
          height: "50%",
          position: "relative",
          overflow: "visible",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h1
          style={{
            color: "white",
            position: "absolute",
            top: "55px",
            fontSize: "30px",
            inlineSize: "100%",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Recuperar tu contraseña
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
            <div style={{ paddingTop: "20px", marginTop: "20px" }}>
              {buton === true ? (
                <Message severity="success" text="Correo enviado, revisa tu bandeja de entrada." className="m-5" />
              ) : buton === false ? (
                <Message severity="error" text="Correo no registrado." className="m-5" />
              ) : (
                <Message severity="info" text="Ingresa tu correo para recuperar tu contraseña." className="m-5" />
              )}
            </div>

            <div
              className="p-field"
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                height: "90px",
                width: "101%",
                marginTop: "2rem",
                position: "relative",
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
                onChange={(text) =>
                  formik.setFieldValue("correo", text.target.value)
                }
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
              className="p-d-flex p-jc-center"
              style={{
                marginTop: "2rem",
                marginLeft: "20%",
                marginRight: "10%",
              }}
            >
              <Button
                label="Enviar correo"
                outlined
                style={{
                  width: "80%",
                  backgroundColor: "white",
                  color: "#179275",
                  fontSize: "19px",
                }}
                type="submit"
                loading={formik.isSubmitting}
              />
            </div>
          </form>

          <div
            className="p-d-flex p-jc-center"
            style={{
              marginTop: "2rem",
              marginLeft: "15%",
              marginRight: "15%",
            }}
          >
            <Button
              label="Regresar"
              style={{
                backgroundColor: "#102b51",
                color: "white",
                fontSize: "18px",
              }}
              onClick={() => {
                navigation("/");
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
