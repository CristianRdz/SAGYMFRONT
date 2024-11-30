import { object } from "yup";
import AxiosClient from "../../plugins/axios";
import UsuarioService from "../usuarios/UsuarioService";
const userInfo = JSON.parse(localStorage.getItem("user"));
async function recalcular(rutina) {
  const recalcular = await AxiosClient({
    method: "GET",
    url: `/rutina/recalcular/${rutina.id_rutina}`,
  });
  return recalcular;
}
async function getAll() {
  let response = null;
  let rol = userInfo.user.usuario.rol.id_rol;
  let id_usuario = userInfo.user.usuario.id_usuario;
  rol = parseInt(rol);
  if (rol == 1) {
    response = await AxiosClient({
      method: "GET",
      url: "/rutina/",
    });
  } else {
    response = await AxiosClient({
      method: "GET",
      url: "/rutina/instructor/" + id_usuario,
    });
  }
  return response;
}
async function getRutinasSinAsignar() {
  let response = null;
  let rol = userInfo.user.usuario.rol.id_rol;
  let id_usuario = userInfo.user.usuario.id_usuario;
  id_usuario = parseInt(id_usuario);
  rol = parseInt(rol);
  if (rol == 1) {
    response = await AxiosClient({
      method: "GET",
      url: "/rutina/sinasignar/",
    });
  } else {
    response = await AxiosClient({
      method: "GET",
      url: `/rutina/sinasignar/${id_usuario}`,
    });
  }
  return response;
}
async function create(nombre_rutina, values, ejercicio) {
  let id_usuario = userInfo.user.usuario.id_usuario;
  let instructor = await UsuarioService.getById(id_usuario);
  instructor = instructor.data;
  const creacionRutina = await AxiosClient({
    method: "POST",
    url: "/rutina/",
    data: JSON.stringify({
      nombre_rutina: nombre_rutina,
      instructor: instructor,
    }),
  });
  const rutina = creacionRutina.data;
  let ejercicios = [];
  let responses = [];
  for (let i = 0; i < ejercicio.length; i++) {
    let ejercicioParaPost = {};
    ejercicioParaPost.rutina = rutina;
    ejercicioParaPost.ejercicio = ejercicio[i];
    ejercicioParaPost.repeticiones = values[`repeticiones-${i}`];
    ejercicioParaPost.peso = values[`peso-${i}`];
    ejercicios.push(ejercicioParaPost);
  }
  ejercicios.forEach(async (ejercicio) => {
    const response = await AxiosClient({
      method: "POST",
      url: "/ejer_asig/",
      data: JSON.stringify(ejercicio),
    });
    responses.push(response);
  });
  return responses;
}
async function update(rutina, values, ejercicio) {
  let ejercicios = [];
  let responses = [];
  ejercicio.forEach((ejercicio, index) => {
    let ejercicioParaPost = {};
    ejercicioParaPost.id_asignacion = ejercicio.id_asignacion;
    ejercicioParaPost.rutina = rutina;
    ejercicioParaPost.ejercicio = ejercicio.ejercicio;
    ejercicioParaPost.repeticiones = values[`repeticiones-${index}`];
    ejercicioParaPost.peso = values[`peso-${index}`];
    ejercicios.push(ejercicioParaPost);
  });
  ejercicios.forEach(async (ejercicio) => {
    const response = await AxiosClient({
      method: "POST",
      url: "/ejer_asig/",
      data: JSON.stringify(ejercicio),
    });
    responses.push(response);
  });
  const recalcular = await AxiosClient({
    method: "GET",
    url: `/rutina/recalcular/${rutina.id_rutina}`,
  });
  console.log("Se recalcularon los datos de la rutina")
  responses.push(recalcular);
  return responses;
}
async function eliminarEjercicio(id) {
  const response = await AxiosClient({
    method: "DELETE",
    url: `/ejer_asig/${id}`,
  });
  return response;
}

async function updateRutina(rutina) {
  const response = await AxiosClient({
    method: "PUT",
    url: `/rutina/`,
    data: JSON.stringify(rutina),
  });
  return response;
}
async function updateProgreso(progreso) {
  const response = await AxiosClient({
    method: "PUT",
    url: `/progreso/`,
    data: JSON.stringify(progreso),
  });
  return response;
}

async function getEjerciciosAsignados(id) {
  const response = await AxiosClient({
    method: "GET",
    url: `/ejer_asig/rutina2/${id}`,
  });
  return response;
}
async function getProgresos(id) {
  const response = await AxiosClient({
    method: "GET",
    url: `/progreso/rutina/${id}`,
  });
  return response;
}
async function asignarRutina(id_rutina, id_usuario, dias_meta) {
  const response = await AxiosClient({
    method: "GET",
    ///asignarRutina/{id_rutina}/{id_usuario}/{dias_meta}
    url: `/rutina/asignarRutina/${id_rutina}/${id_usuario}/${dias_meta}`,
  });
  return response;
}
async function deleteRutina(id_rutina) {
  const response = await AxiosClient({
    method: "DELETE",
    url: `/rutina/${id_rutina}`,
  });
  return response;
}
async function deleteProgreso(id_progreso) {
  const response = await AxiosClient({
    method: "DELETE",
    url: `/progreso/${id_progreso}`,
  });
  return response;
}

export default {
  updateProgreso,
  deleteProgreso,
  deleteRutina,
  getProgresos,
  asignarRutina,
  recalcular,
  updateRutina,
  eliminarEjercicio,
  update,
  create,
  getAll,
  getRutinasSinAsignar,
  getEjerciciosAsignados,
};
