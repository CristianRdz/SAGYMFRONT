import { Tag } from "primereact/tag";

function roles() {
  const rols = [
    {
      key: "1",
      label: "Admin",
    },
    {
      key: "2",
      label: "Instructor",
    },
    {
      key: "3",
      label: "Usuario Gimnasio",
    },
  ];
  return rols;
}
function getRoles(rol) {
  if (rol === "Admin") {
    return "primary";
  } else if (rol === "Instructor") {
    return "info";
  } else if (rol === "Usuario Gimnasio") {
    return "success";
  }
}

function verificarRol(rol) {
  return (
    <Tag
      value={rol}
      severity={getRoles(rol)}
      style={{
        position: "relative",
        width: "85%",
        height: "5%",
        fontSize: "1em",
        marginLeft: "7%",
        textAlign: "center",
      }}
    />
  );
}

function cambiarTitulo(titulo) {
  if (titulo === "rol.nombre_rol") {
    return "Rol";
  } else if (titulo.includes("_")) {
    titulo = titulo.replace("_", " ");
    titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
  } else {
    titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
  }
  return titulo;
}
function alerta(
  tipo,
  mensaje,
  messages,
  setMensajeAlerta,
  setMostrarAlerta,
  setTipoAlerta
) {
  messages.current.show({
    severity: tipo,
    detail: mensaje,
    life: 6000,
  });
  setMensajeAlerta("");
  setMostrarAlerta(false);
  setTipoAlerta("");
}

export default {
  cambiarTitulo,
  verificarRol,
  getRoles,
  alerta,
  roles,
};
