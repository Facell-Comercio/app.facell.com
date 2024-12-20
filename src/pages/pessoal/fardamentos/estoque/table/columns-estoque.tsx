import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";
import { Dropdown } from "../components/DropdownMenu";
import { ItemEstoqueFardamento } from "../types";


export type RowEstoque = {
  select: ReactNode;
}&ItemEstoqueFardamento;
export const columnsTableEstoques: ColumnDef<RowEstoque>[] = [
  {
    accessorKey: "id",
    header: "AÇÕES",
    enableSorting: false,
    cell: (info) => {
      return(
        <span>
         <Dropdown data={info.row.original} />
        </span>

      )
  },
    sortDescFirst: true,
  },
  {
    accessorKey: "grupo_economico",
    header: "GRUPO",
  },
  {
    accessorKey: "uf",
    header: "UF",
  },
  {
    accessorKey: "modelo",
    header: "MODELO",
  },
  {
    accessorKey: "tamanho",
    header: "TAMANHO",
  },
  {
    accessorKey: "sexo",
    header: "SEXO",
  },
  {
    accessorKey: "saldo",
    header: "SALDO",
  },

];
