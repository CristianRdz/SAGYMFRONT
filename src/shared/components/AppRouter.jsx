import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "../../modules/auth/authContext";

import { Menu } from "./Menu";
import { NavBar } from "./NavBar";
import { Error } from "./comun/Error";

//componentes
import { Login } from "../../modules/auth/Login";
import { RecoverPassword } from "../../modules/auth/RecoverPassword";
import { TableExercise } from "../../modules/ejercicios/TableExercise";
import { TableRoutine } from "../../modules/rutinas/TableRoutine";
import { TableUser } from "../../modules/usuarios/TableUser";
import { ProfileUser } from "../../modules/usuarios/ProfileUser";
import { ConfirmPassword } from "../../modules/auth/ConfirmPassword";

export const AppRouter = () => {
  const { user, token, rol } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Login />} />
        <Route
          path="/*"
          element={
            user.isLogged ? (
              <>
                <NavBar />
                <Routes>
                  <Route path="usuarios" element={<TableUser />} />
                  <Route path="ejercicios" element={<TableExercise />} />
                  <Route path="rutinas" element={<TableRoutine />} />
                  <Route path="perfil" element={<ProfileUser />} />
                  <Route path="confirmar" element={<ConfirmPassword />} />
                  <Route path="/" element={<Menu />} />
                  <Route path="*" element={<Error />} />
                </Routes>
              </>
            ) : (
              <>
                <Routes>
                  <Route path="recuperar" element={<RecoverPassword />} />
                  <Route path="confirmar" element={<ConfirmPassword />} />
                  <Route index element={<Login />} />
                  
                  <Route path="*" element={<Error />} />
                </Routes>
              </>
            )
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
};
