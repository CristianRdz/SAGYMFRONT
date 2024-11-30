import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import UsuarioService from "../../shared/services/usuarios/UsuarioService";
import Functions from "../../shared/components/comun/Functions";
//iconos
import { HiUserCircle } from "react-icons/hi";
import { TbCircleFilled } from "react-icons/tb";

//componentes
import { ChangePassword } from "./ChangePassword";

//primereact
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Messages } from "primereact/messages";
import "typeface-raleway";

export const ProfileUser = () => {
  const usuarioActual = JSON.parse(localStorage.getItem("user"));
  const [usuarios, setUsuarios] = useState({});
  const [isOpen, setisOpen] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const messages = useRef(null);

  useEffect(() => {
    document.title = "Perfil";
    getUsuario();
    if (mensajeAlerta !== "" && mostrarAlerta === true && tipoAlerta !== "") {
      Functions.alerta(
        tipoAlerta,
        mensajeAlerta,
        messages,
        setMensajeAlerta,
        setMostrarAlerta,
        setTipoAlerta
      );
    }
  }, [mensajeAlerta, mostrarAlerta, tipoAlerta]);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      telefono: "",
      peso: "",
      altura: "",
    },
    validationSchema: Yup.object().shape({
      nombre: Yup.string().required("Por favor, ingresa el nombre."),
      apellido_paterno: Yup.string().required(
        "Por favor, ingresa el apellido paterno."
      ),
      apellido_materno: Yup.string().required(
        "Por favor, ingresa el apellido materno."
      ),
      telefono: Yup.string()
        .min(10, "El teléfono debe tener 10 dígitos.")
        .max(10, "El teléfono debe tener 10 dígitos.")
        .required("Por favor, ingresa tu teléfono."),
      peso: Yup.string(),
      altura: Yup.string(),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const pesoSin = values.peso.replace("kg", "");
        const alturaSin = values.altura.replace("cm", "");
        const usuarioUpdate = {
          id_usuario: usuarios.id_usuario,
          nombre: values.nombre,
          apellido_paterno: values.apellido_paterno,
          apellido_materno: values.apellido_materno,
          telefono: values.telefono,
          peso: pesoSin ? pesoSin : usuarios.peso,
          altura: alturaSin ? alturaSin : usuarios.altura,
        };
        const response = await UsuarioService.update(usuarioUpdate);
        if (!response.error) {
          setMensajeAlerta(response.message);
          setMostrarAlerta(true);
          setTipoAlerta("success");

          handleEditClick();
        } else {
          setMensajeAlerta(response.message);
          setMostrarAlerta(true);
          setTipoAlerta("error");
        }
      } catch (error) {
        setMensajeAlerta(error.message);
        setMostrarAlerta(true);
        setTipoAlerta("error");
        console.log(error);
      }
    },
  });
  const getUsuario = async () => {
    try {
      const response = await UsuarioService.getById(
        usuarioActual.user.usuario.id_usuario
      );
      if (!response.error) {
        setUsuarios(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useMemo(() => {
    const {
      nombre,
      apellido_materno,
      apellido_paterno,
      telefono,
      altura,
      peso,
    } = usuarios;
    formik.values.nombre = nombre ? nombre : "";
    formik.values.apellido_paterno = apellido_paterno ? apellido_paterno : "";
    formik.values.apellido_materno = apellido_materno ? apellido_materno : "";
    formik.values.telefono = telefono ? telefono : "";
    formik.values.altura = `${altura}cm` ? `${altura}cm` : "";
    formik.values.peso = `${peso}kg` ? `${peso}kg` : "";
  }, [usuarios]);

  const handleEditClick = () => {
    setIsDisabled(!isDisabled);
    setIsEditing(!isEditing);
  };

  return (
    <div style={{ display: "flex" }}>
      <ChangePassword
        isOpen={isOpen}
        onClose={() => setisOpen(false)}
        setUsuarios={setUsuarios}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
      />
      <Card
        title="Perfil"
        style={{
          width: "30%",
          height: "100%",
          position: "relative",
          marginTop: "6%",
          marginRight: "1%",
          marginLeft: "1%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <HiUserCircle
            style={{
              marginTop: "-5%",
              color: "#179275",
              width: "60%",
              height: "60%",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.5em",
              textAlign: "center",
              color: "black",
            }}
          >
            {usuarios.nombre} {usuarios.apellido_paterno}{" "}
            {usuarios.apellido_materno}
          </p>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.5em",
              textAlign: "center",
              color: "black",
            }}
          >
            {usuarioActual.user.usuario.correo}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginTop: "1%",
          }}
        >
          <TbCircleFilled
            style={{
              color: "#179275",
              width: "9%",
              height: "9%",
            }}
          />
          <p
            style={{
              marginLeft: "2%",
              fontWeight: "bold",
              fontSize: "1.2em",
              color: "#179275",
            }}
          >
            Activo
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.5em",
              color: "black",
            }}
          >
            {Functions.verificarRol(usuarioActual.user.usuario.rol.nombre_rol)}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "1%",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.2em",
              color: "black",
            }}
          >
            <Button
              label="Cambiar contraseña"
              onClick={() => setisOpen(true)}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#193c72",
                color: "white",
                fontSize: "1em",
              }}
              icon="pi pi-lock"
            />
          </p>
        </div>
      </Card>
      <Card
        title="Datos personales"
        style={{
          width: "70%",
          height: "100%",
          position: "relative",
          marginTop: "6%",
          marginLeft: "1%",
          marginRight: "1%",
        }}
      >
        <Messages
          ref={messages}
          style={{
            position: "relative",
            top: "0",
            left: "0",
            width: "100%",
            marginTop: "2%",
          }}
        />
        <form onSubmit={formik.handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",

                  width: "50%",
                }}
              >
                <label htmlFor="nombre">Nombre</label>
                <InputText
                  id="nombre"
                  name="nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.errors.nombre && formik.touched.nombre
                      ? "is-invalid"
                      : ""
                  }`}
                  disabled={isDisabled}
                />
                {formik.errors.nombre && formik.touched.nombre && (
                  <small className="p-error">{formik.errors.nombre}</small>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  marginLeft: "1%",
                }}
              >
                <label htmlFor="apellido_paterno">Apellido paterno</label>
                <InputText
                  id="apellido_paterno"
                  name="apellido_paterno"
                  value={formik.values.apellido_paterno}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.errors.apellido_paterno &&
                    formik.touched.apellido_paterno
                      ? "is-invalid"
                      : ""
                  }`}
                  disabled={isDisabled}
                />
                {formik.errors.apellido_paterno &&
                  formik.touched.apellido_paterno && (
                    <small className="p-error">
                      {formik.errors.apellido_paterno}
                    </small>
                  )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                }}
              >
                <label htmlFor="apellido_materno">Apellido materno</label>
                <InputText
                  id="apellido_materno"
                  name="apellido_materno"
                  value={formik.values.apellido_materno}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.errors.apellido_materno &&
                    formik.touched.apellido_materno
                      ? "is-invalid"
                      : ""
                  }`}
                  disabled={isDisabled}
                />
                {formik.errors.apellido_materno &&
                  formik.touched.apellido_materno && (
                    <small className="p-error">
                      {formik.errors.apellido_materno}
                    </small>
                  )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  marginLeft: "1%",
                }}
              >
                <label htmlFor="telefono">Telefono</label>
                <InputText
                  id="telefono"
                  name="telefono"
                  value={formik.values.telefono}
                  onChange={formik.handleChange}
                  className={`form-control ${
                    formik.errors.telefono && formik.touched.telefono
                      ? "is-invalid"
                      : ""
                  }`}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  disabled={isDisabled}
                />
                {formik.errors.telefono && formik.touched.telefono && (
                  <small className="p-error">{formik.errors.telefono}</small>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                }}
              >
                <label htmlFor="peso">Peso</label>
                <InputText
                  id="peso"
                  name="peso"
                  value={formik.values.peso}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  marginLeft: "1%",
                }}
              >
                <label htmlFor="altura">Altura</label>
                <InputText
                  id="altura"
                  name="altura"
                  value={formik.values.altura}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                />
              </div>
            </div>
          </div>{" "}
          <div style={{ textAlign: "right" }}>
            <Button
              label={isEditing ? "Cancelar" : "Editar"}
              icon={isEditing ? "pi pi-times" : "pi pi-user-edit"}
              className={isEditing ? "p-button-danger" : "p-button-info"}
              type="button"
              onClick={handleEditClick}
              style={{
                marginLeft: ".25em",
                marginRight: ".25em",
                marginTop: "1em",
              }}
            />
            {isEditing && (
              <Button
                label="Guardar"
                icon="pi pi-check"
                type="submit"
                className="p-button-success"
                onClick={formik.handleSubmit}
              />
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};
