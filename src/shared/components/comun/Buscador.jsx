import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";

export const Buscador = ({
  globalFilterValue,
  setGlobalFilterValue,
  setFilters,
  onGlobalFilterChange,
  FilterMatchMode
}) => {
  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };
  return (
    <div className="flex justify-content-between">
      <Button
        type="button"
        icon="pi pi-filter-slash"
        label="Limpiar"
        onClick={clearFilter}
        style={{
          marginRight: ".25em",
          backgroundColor: "#193c72",
          color: "white",
          border: "none",
        }}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );
};
