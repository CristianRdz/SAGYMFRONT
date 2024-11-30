import React, { useEffect, useReducer } from "react";
import { authReducer } from "./modules/auth/authReducer";
import { AuthContext } from "./modules/auth/authContext";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { AppRouter } from "./shared/components/AppRouter";

const init = () => {
  return JSON.parse(localStorage.getItem("user")) || { isLogged: false };
};

const App = () => {
  const [user, dispatch] = useReducer(authReducer, {}, init);
  useEffect(() => {
    if (!user) return;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);
    if (user.user?.usuario?.rol?.nombre_rol) {
      localStorage.setItem("rol", user.user.usuario.rol.nombre_rol);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ dispatch, user }}>
      <AppRouter />
    </AuthContext.Provider>
  );
};

export default App;
