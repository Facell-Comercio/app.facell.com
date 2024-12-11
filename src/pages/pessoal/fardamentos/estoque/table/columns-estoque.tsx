import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";
import { Dropdown } from "../components/DropdownMenu";


export type RowEstoque = {
    select: ReactNode;
    id: string;
    grupo_economico: string;
    uf: string;
    modelo: string;
    tamanho: string;
    sexo: string;
}
export const columnsTableEstoques: ColumnDef<RowEstoque>[] = [
    {
        accessorKey: "id",
        header: "AÇÕES",
        enableSorting: false,
        cell: (info) => (
           <span>
              <Dropdown id={info.getValue<number>()} />
           </span>
        ),
        sortDescFirst: true,
    },
    {
        accessorKey: "grupo_economico",
        header: "GRUPO"
    },
    {
        accessorKey: "uf",
        header: "UF"
    },
    {
        accessorKey: "modelo",
        header: "MODELO"
    },
    {
        accessorKey: "tamanho",
        header: "TAMANHO"
    },
    {
        accessorKey: "sexo",
        header: "SEXO"
    },
    {
        accessorKey: "saldo",
        header: "SALDO"
    }
];