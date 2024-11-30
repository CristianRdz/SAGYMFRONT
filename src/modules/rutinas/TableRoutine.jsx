import React, { useEffect, useRef, useState } from "react";
import Functions from "../../shared/components/comun/Functions";
import RutinaService from "../../shared/services/rutinas/RutinaService";

//componentes
import { RoutineForm } from "./RoutineForm";
import { RoutineEditForm } from "./RoutineEditForm";
import { RoutineMoreInfo } from "./RoutineMoreInfo";
import { Agregar } from "../../shared/components/comun/Agregar";
import { Buscador } from "../../shared/components/comun/Buscador";

//primereact
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Messages } from "primereact/messages";
import { DataTable } from "primereact/datatable";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { RoutineAssign } from "./RoutineAssign";
import { RoutineNewExercise } from "./RoutineNewExercise";
import Alert, {
  confirmMsj,
  confirmTitle,
  errorTitle,
} from "../../shared/plugins/alert";

export const TableRoutine = () => {
  const [rutina, setRutina] = useState([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [ejercicios, setEjercicios] = useState([]);
  const [isEditing, setisEditting] = useState(false);
  const [isMoreInfo, setisMoreInfo] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [isAsignar, setisAsignar] = useState(false);
  const [initialState, setInitialState] = useState(false);
  const [nuevoEjercicio, setnuevosEjercicio] = useState(false);
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

  const getRutinas = async () => {
    setisLoading(true);
    try {
      const response = await RutinaService.getAll();
      setRutina(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  const eliminarRutina = async (id) => {
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
          const response = await RutinaService.deleteRutina(id);
          if (!response.error) {
            setMensajeAlerta(response.message);
            setMostrarAlerta(true);
            setTipoAlerta("success");
          } else {
            setMensajeAlerta(response.message);
            setMostrarAlerta(true);
            setTipoAlerta("error");
          }
          await getRutinas();
        } catch (error) {
          Alert.error(errorTitle);
        }
      },
    });
  };

  useEffect(() => {
    getRutinas();
    clearFilter();
    document.title = "Rutinas";
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

  const getEjerciciosAsignados = async (id) => {
    setisLoading(true);
    try {
      const response = await RutinaService.getEjerciciosAsignados(id);
      setEjercicios(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  const columnas = React.useMemo(() => [
    /*
    {
      name: "id_rutina",
    },
   */
    {
      name: "nombre_rutina",
    },
    {
      name: "Ejercicios y progreso",
    },
    {
      name: "Acciones",
    },
  ]);

  const head = () => {
    return (
      <>
        <Button
          label="Asignar"
          icon="pi pi-calendar"
          onClick={() => {
            setisEditting(false);
            setisOpen(false);
            setisAsignar(true);
          }}
          style={{
            position: "relative",
            justifyContent: "end",
            alignItems: "end",
            float: "right",
            marginRight: "15%",
            marginTop: "3.2%",
            backgroundColor: "#193c72",
            border: "none",
          }}
        />
        <Agregar setisOpen={setisOpen} setisEditting={setisEditting} />
      </>
    );
  };

  return (
    <Card
      title="Gestión de Rutinas"
      style={{
        width: "95%",
        margin: "auto",
        marginTop: "7rem",
        marginBottom: "2rem",
      }}
      header={head}
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
      <RoutineForm
        isOpen={isOpen}
        onClose={() => setisOpen(false)}
        setRutina={setRutina}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
        setisOpen={setisOpen}
        initialState={initialState}
        setInitialState={setInitialState}
      />
      <RoutineEditForm
        isOpen={isEditing}
        onClose={() => setisEditting(false)}
        setRutina={setRutina}
        rutina={rutinaSeleccionada}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
      />
      <RoutineMoreInfo
        isOpen={isMoreInfo}
        onClose={() => setisMoreInfo(false)}
        setRutina={setRutina}
        rutina={rutinaSeleccionada}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
        ejercicios={ejercicios}
        setEjercicios={setEjercicios}
        getExercise={getEjerciciosAsignados}
      />
      <RoutineAssign
        isOpen={isAsignar}
        onClose={() => setisAsignar(false)}
        setRutina={setRutina}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
      />
      <RoutineNewExercise
        getExercise={getEjerciciosAsignados}
        isOpen={nuevoEjercicio}
        onClose={() => setnuevosEjercicio(false)}
        setRutina={setRutina}
        rutina={rutinaSeleccionada}
        setisOpen={setnuevosEjercicio}
        initialState={initialState}
        setInitialState={setInitialState}
        setMensajeAlerta={setMensajeAlerta}
        setMostrarAlerta={setMostrarAlerta}
        setTipoAlerta={setTipoAlerta}
        ejercicios={ejercicios}
        setEjercicios={setEjercicios}
      />
      <DataTable
        value={rutina}
        tableStyle={{ minWidth: "50rem" }}
        paginator
        showGridlines
        rows={5}
        loading={isLoading}
        rowsPerPageOptions={[5, 10]}
        emptyMessage="No hay rutinas registradas"
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
                      icon="pi pi-pencil"
                      severity="warning"
                      onClick={() => {
                        setRutinaSeleccionada(rowData);
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
                      onClick={eliminarRutina.bind(this, rowData.id_rutina)}
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                )}
              />
            );
          } else if (columna.name === "Ejercicios y progreso") {
            return (
              <Column
                key={index}
                field={columna.name}
                header={Functions.cambiarTitulo(columna.name)}
                style={{ width: "15%" }}
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
                      onClick={async () => {
                        await getEjerciciosAsignados(rowData.id_rutina);
                        setRutinaSeleccionada(rowData);
                        setisMoreInfo(true);
                      }}
                      style={{
                        marginLeft: "0.3rem",
                        marginRight: "0.3rem",
                        width: "40px",
                        height: "40px",
                      }}
                    />
                    <Button
                      icon="pi  pi-plus"
                      severity="success"
                      onClick={async () => {
                        await getEjerciciosAsignados(rowData.id_rutina);
                        setRutinaSeleccionada(rowData);
                        setnuevosEjercicio(true);
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
                style={{ width: "70%" }}
                filterField={columna.name}
              />
            );
          }
        })}
      </DataTable>
    </Card>
  );
};
