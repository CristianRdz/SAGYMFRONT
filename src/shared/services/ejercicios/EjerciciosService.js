import AxiosClient from "../../plugins/axios";

async function getAll() {
  const response = await AxiosClient({
    method: "GET",
    url: "/ejercicio/",
  });
  return response;
}
async function getById(id) {
  const response = await AxiosClient({
    method: "GET",
    url: `/ejercicio/${id}`,
  });
  return response;
}
async function create(nombre, descripcion) {
//   {
//     "nombre": "Cumbias",
//     "descripcion": "Rayas"
// }
  const response = await AxiosClient({
    method: "POST",
    url: "/ejercicio/",
    data: {
      nombre,
      descripcion,
    },
  });
  return response;
}
async function update(id_ejercicio, nombre, descripcion) {
  const response = await AxiosClient({
    method: "PUT",
    url: `/ejercicio/`,
    data: {
      id_ejercicio,
      nombre,
      descripcion,
    },
  });
  return response;
}
async function deleteById(id) {
  const response = await AxiosClient({
    method: "DELETE",
    url: `/ejercicio/${id}`,
  });
  return response;
}
export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};