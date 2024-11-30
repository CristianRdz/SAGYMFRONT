import AxiosClient from "../../plugins/axios";
async function getAll() {
  const response = await AxiosClient({
    method: "GET",
    url: "/adjunto/",
  });
  return response;
}
async function getByEjercicio(id) {
    const response = await AxiosClient({
        method: "GET",
        url: `/adjunto/ejercicio/${id}`,
    });
    return response;
    }
async function getById(id) {
    const response = await AxiosClient({
        method: "GET",
        url: `/adjunto/${id}`,
    });
    return response;
    }
async function create(nombre_archivo, enlace, tipo_elemento, ejercicio) {
    const response = await AxiosClient({
        method: "POST",
        url: "/adjunto/",
        data: {
            nombre_archivo,
            enlace,
            tipo_elemento,
            ejercicio,
        },
    });
    return response;
}
async function update(id_elemento, nombre_archivo, enlace, tipo_elemento, ejercicio) {
    const response = await AxiosClient({
        method: "PUT",
        url: `/adjunto/`,
        data: {
            id_elemento,
            nombre_archivo,
            enlace,
            tipo_elemento,
            ejercicio,
        },
        
    });
    const data = await response.data;
    console.log(data);
    return response;
}
async function deleteById(id) {
    const response = await AxiosClient({
        method: "DELETE",
        url: `/adjunto/${id}`,
    });
    return response;
}
export default {
    getAll,
    getById,
    create,
    update,
    deleteById,
    getByEjercicio,
};
