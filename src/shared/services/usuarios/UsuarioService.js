import AxiosClient from "../../plugins/axios";
import { API_URL } from "../../utils/constants";
const userInfo = JSON.parse(localStorage.getItem("user"));
async function login(values) {
  const response = await AxiosClient({
    method: "POST",
    url: "/auth/login",
    data: JSON.stringify(values),
  });
  return response;
}

async function getAll() {
  let response = null;
  let rol = userInfo.user.usuario.rol.id_rol;
  if (rol == 1) {
  response = await AxiosClient({
    method: "GET",
    url: "/usuario/",
  });
  } else {
  response = await AxiosClient({
    method: "GET",
    url: "/usuario/rol/3",
  });
  }
  return response;
}

async function getById(id) {
  const response = await AxiosClient({
    method: "GET",
    url: `/usuario/${id}`,
  });
  return response;
}

async function getAllByRol(rol) {
  const response = await AxiosClient({
    method: "GET",
    url: `/usuario/rol/${rol}`,
  });
  return response;
}

async function create(values) {
  const response = await AxiosClient({
    method: "POST",
    url: "/usuario/",
    data: JSON.stringify(values),
  });
  return response;
}

async function update(values) {
  const response = await AxiosClient({
    method: "PUT",
    url: `/usuario/`,
    data: JSON.stringify(values),
  });
  return response;
}

async function deleteById(id) {
  const response = await AxiosClient({
    method: "DELETE",
    url: `/usuario/${id}`,
  });
  return response;
}
export async function recoverPassword(email) {
  try {
    const url = `${API_URL}/api/auth/reset-password/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo: email }),
    };

    const response = await fetch(url, params);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function confirmPassword(token, password, confirmPassword) {
  try {
    const url = `${API_URL}/api/auth/reset-password/confirm/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //{
      //     "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIxM3RuMDg2QHV0ZXouZWR1Lm14IiwiaWF0IjoxNjgwODI4NDY5LCJleHAiOjE2ODA4NzE2Njl9.XrY1_UBiz67_yk-R4BOHqsYgeq9ejxQTzZmJhvxqtq95ouotMM6deC4BWWTAc-qx2VW0SBVn-2sQjNBe-1NH6Q",
      //     "password":"123456",
      //     "confirmPassword":"123456"
      // }
      body: JSON.stringify({
        token: token,
        password: password,
        confirmPassword: confirmPassword,
      }),
    };
    const response = await fetch(url, params);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function validarUsuario(email, password) {
  try {
    const url = `${API_URL}/api/auth/login/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo: email, contrasena: password }),
    };
    const response = await fetch(url, params);
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function changePassword(password, newPassword) {
  try {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const token = userInfo.token;
    const correo = userInfo.user.usuario.correo;
    const datos = await getById(userInfo.user.usuario.id_usuario);
    let user = datos.data;
    const verified = await validarUsuario(correo, password);
    if (verified) {
      user.contrasena = newPassword;
      const url = `${API_URL}/api/usuario/pass/`;
      console.log(user);
      const params = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      };
      const response = await fetch(url, params);
      const result = await response.json();
      if (result.data) {
        console.log(result.message);
        return true;
      }
      console.log("not updated");
      return null;
    } else {
      console.log("not verified");
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default {
  changePassword,
  confirmPassword,
  recoverPassword,
  login,
  getAll,
  getById,
  getAllByRol,
  create,
  update,
  deleteById,
};
