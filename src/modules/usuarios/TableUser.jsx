import React, { useState, useEffect, useRef } from "react";
import UsuarioService from "../../shared/services/usuarios/UsuarioService";
import Functions from "../../shared/components/comun/Functions";
//componentes
import { UserEditForm } from "./UserEditForm";
import { MoreInformation } from "./MoreInformation";
import { Buscador } from "../../shared/components/comun/Buscador";
import { Agregar } from "../../shared/components/comun/Agregar";

//primereact
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import { Card } from "primereact/card";
import { UserForm } from "./UserForm";
import Alert, {
  confirmMsj,
  confirmTitle,
  errorTitle,
} from "../../shared/plugins/alert";

export const TableUser = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setisEditting] = useState(false);
  const [isMoreInfo, setisMoreInfo] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    apellido_paterno: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    apellido_materno: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    correo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    telefono: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "rol.nombre_rol": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const messages = useRef(null);

  const getUsuarios = async () => {
    setisLoading(true);
    try {
      const data = await UsuarioService.getAll();
      setUsuarios(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    getUsuarios();
    clearFilter();
    document.title = "Usuarios";
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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const eliminarUsuario = async (id) => {
    Alert.fire({
      title: confirmTitle,
      text: confirmMsj,
      icon: "warning",
      confirmButtonColor: "#009574",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#DD6B55",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      backdrop: true,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Alert.isLoading,
      preConfirm: async () => {
        try {
          const response = await UsuarioService.deleteById(id);
          if (!response.error) {
            setMensajeAlerta(response.message);
            setMostrarAlerta(true);
            setTipoAlerta("success");
          } else {
            setMensajeAlerta(response.message);
            setMostrarAlerta(true);
            setTipoAlerta("error");
          }
          await getUsuarios();
        } catch (error) {
          Alert.error(errorTitle);
        }
      },
    });
  };

  const header = (
    <Buscador
      globalFilterValue={globalFilterValue}
      onGlobalFilterChange={onGlobalFilterChange}
      setFilters={setFilters}
      setGlobalFilterValue={setGlobalFilterValue}
      FilterMatchMode={FilterMatchMode}
    />
  );

  const columnas = React.useMemo(() => [
    /*
    {
      name: "id_usuario",
    },
   */
    {
      name: "nombre",
    },
    {
      name: "apellido_paterno",
    },
    {
      name: "apellido_materno",
    },
    {
      name: "correo",
    },
    {
      name: "telefono",
    },
    {
      name: "rol.nombre_rol",
    },
    {
      name: "Acciones",
    },
  ]);

  return (
    <Card
      title="Gestión de Usuarios"
      style={{
        width: "95%",
        margin: "auto",
        marginTop: "7rem",
        marginBottom: "2rem",
      }}
      header={<Agregar setisEditting={setisEditting} setisOpen={setisOpen} />}
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
      <UserForm
        isOpen={isOpen}
        onClose={() => setisOpen(false)}
        setUsuarios={setUsuarios}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
      />
      <UserEditForm
        isOpen={isEditing}
        onClose={() => setisEditting(false)}
        setUsuarios={setUsuarios}
        usuario={selectedUsuario}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
      />
      <MoreInformation
        isOpen={isMoreInfo}
        onClose={() => setisMoreInfo(false)}
        usuario={selectedUsuario}
      />
      <DataTable
        value={usuarios}
        tableStyle={{ minWidth: "50rem" }}
        paginator
        showGridlines
        rows={5}
        loading={isLoading}
        rowsPerPageOptions={[5, 10]}
        emptyMessage="No hay usuarios registrados"
        header={header}
        globalFilterFields={[
          "nombre",
          "apellido_paterno",
          "apellido_materno",
          "correo",
          "telefono",
          "rol.nombre_rol",
        ]}
        globalFilter={filters["global"].value}
        filters={filters}
      >
        {columnas.map((columna, index) => {
          if (columna.name === "Acciones") {
            return (
              <Column
                key={index}
                field={columna.name}
                header={Functions.cambiarTitulo(columna.name)}
                style={{ width: "20%" }}
                body={(rowData) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      icon="pi pi-eye"
                      severity="info"
                      onClick={() => {
                        setisMoreInfo(true);
                        setSelectedUsuario(rowData);
                      }}
                      style={{ width: "40px", height: "40px" }}
                    />
                    <Button
                      icon="pi pi-pencil"
                      severity="warning"
                      onClick={() => {
                        setSelectedUsuario(rowData);
                        setisEditting(true);
                      }}
                      style={{
                        marginLeft: "0.3rem",
                        marginRight: "0.3rem",
                        width: "40px",
                        height: "40px",
                      }}
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      onClick={eliminarUsuario.bind(this, rowData.id_usuario)}
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                )}
              />
            );
          } else if (columna.name === "rol.nombre_rol") {
            return (
              <Column
                key={index}
                field={columna.name}
                header={Functions.cambiarTitulo(columna.name)}
                body={(rowData) =>
                  Functions.verificarRol(rowData.rol.nombre_rol)
                }
                style={{ width: "20%" }}
                sortable
              />
            );
          } else {
            return (
              <Column
                key={index}
                field={columna.name}
                header={Functions.cambiarTitulo(columna.name)}
                sortable
                style={{ width: "20%" }}
                filterField={columna.name}
              />
            );
          }
        })}
      </DataTable>
    </Card>
  );
};
