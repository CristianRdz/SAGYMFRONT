import React, { useEffect, useRef, useState } from "react";
import Functions from "../../shared/components/comun/Functions";
import EjerciciosService from "../../shared/services/ejercicios/EjerciciosService";
//componentes
import { ExerciseForm } from "./ExerciseForm";
import { ExerciseEditForm } from "./ExerciseEditForm";
import { ShowAttach } from "./ShowAttach";
import { Agregar } from "../../shared/components/comun/Agregar";
import { Buscador } from "../../shared/components/comun/Buscador";

//primereact
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Messages } from "primereact/messages";
import { DataTable } from "primereact/datatable";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Alert, { confirmMsj, confirmTitle } from "../../shared/plugins/alert";
import SubirArchivo from "./components/SubirArchivo";

export const TableExercise = () => {
  const [ejercicio, setEjercicio] = useState([]);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setisEditting] = useState(false);
  const [isMoreInfo, setisMoreInfo] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [isSending, setisSending] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    descripcion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const mensaje = useRef(null);

  const getEjercicios = async () => {
    setisLoading(true);
    try {
      const response = await EjerciciosService.getAll();
      setEjercicio(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  const eliminarEjercicio = async (id) => {
    setisLoading(true);
    try {
      return Alert.fire({
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
          setisLoading(true);
          try {
            const response = await EjerciciosService.deleteById(id);
            setisLoading(false);
            setMensajeAlerta("Ejercicio eliminado correctamente.");
            setTipoAlerta("success");
            setMostrarAlerta(true);
          } catch (error) {
            console.log(error);
            setMensajeAlerta("Error al eliminar el ejercicio.");
            setTipoAlerta("error");
            setMostrarAlerta(true);
          }
        },
      });
    } catch (error) {
      setMensajeAlerta(error.response.data.mensaje);
      setTipoAlerta("error");
      setMostrarAlerta(true);
      setisLoading(false);
    }
  };

  useEffect(() => {
    getEjercicios();
    clearFilter();
    document.title = "Ejercicios";
    if (mensajeAlerta !== "" && mostrarAlerta === true && tipoAlerta !== "") {
      Functions.alerta(
        tipoAlerta,
        mensajeAlerta,
        mensaje,
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

  const header = (
    <Buscador
      globalFilterValue={globalFilterValue}
      setGlobalFilterValue={setGlobalFilterValue}
      setFilters={setFilters}
      onGlobalFilterChange={onGlobalFilterChange}
      FilterMatchMode={FilterMatchMode}
    />
  );

  const columnas = React.useMemo(() => [
    /*
    {
      name: "id_ejercicio",
    },
   */
    {
      name: "nombre",
    },
    {
      name: "descripcion",
    },
    {
      name: "adjuntos",
    },

    {
      name: "Acciones",
    },
  ]);

  return (
    <Card
      title="Gestión de Ejercicios"
      style={{
        width: "95%",
        margin: "auto",
        marginTop: "7rem",
        marginBottom: "2rem",
      }}
      header={<Agregar setisEditting={setisEditting} setisOpen={setisOpen} />}
    >
      <Messages
        ref={mensaje}
        style={{
          position: "relative",
          top: "0",
          left: "0",
          width: "100%",
          marginTop: "2%",
        }}
      />
      <ExerciseForm
        isOpen={isOpen}
        onClose={() => setisOpen(false)}
        setisLoading={setisLoading}
        setEjercicio={setEjercicio}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
      />
      <ExerciseEditForm
        isOpen={isEditing}
        setisLoading={setisLoading}
        onClose={() => setisEditting(false)}
        setEjercicio={setEjercicio}
        ejercicio={ejercicioSeleccionado}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
      />
      <ShowAttach
        isOpen={isMoreInfo}
        onClose={() => setisMoreInfo(false)}
        ejercicio={ejercicioSeleccionado}
        setEjercicio={setEjercicio}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
      />
      <SubirArchivo
        isOpen={isSending}
        onClose={() => setisSending(false)}
        ejercicio={ejercicioSeleccionado}
        setisLoading={setisLoading}
        setEjercicio={setEjercicio}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
      />
      <DataTable
        value={ejercicio}
        tableStyle={{ minWidth: "50rem" }}
        paginator
        showGridlines
        rows={5}
        loading={isLoading}
        rowsPerPageOptions={[5, 10]}
        emptyMessage="No hay ejercicios registrados"
        header={header}
        globalFilterFields={["nombre", "descripcion"]}
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
                style={{ width: "10%" }}
                body={(rowData) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    

                    <Button
                      icon="pi pi-pencil"
                      severity="warning"
                      onClick={() => {
                        setEjercicioSeleccionado(rowData);
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
                      onClick={() => {
                        setEjercicioSeleccionado(rowData);
                        eliminarEjercicio(rowData.id_ejercicio).then(() => {
                          getEjercicios();
                        });
                      }}
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                )}
              />
            );
          } else if (columna.name === "adjuntos") {
            return (
              <Column
                key={index}
                field={columna.name}
                header={Functions.cambiarTitulo(columna.name)}
                style={{ width: "7%" }}
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
                        setEjercicioSeleccionado(rowData);
                      }}
                      style={{ width: "40px", height: "40px" }}
                    />
                    <Button
                      title="Añadir adjuntos"
                      icon="pi pi-plus"
                      severity="success"
                      onClick={() => {
                        setisSending(true);
                        setEjercicioSeleccionado(rowData);
                      }}
                      style={{
                        marginLeft: "0.3rem",
                        marginRight: "0.3rem",
                        width: "40px",
                        height: "40px",
                      }}
                    />
                  </div>
                )}
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
