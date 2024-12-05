import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button"


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
        cell: () => (
        <Button size={"xs"}>
            <Ellipsis/>
        </Button>   
        ),
        sortDescFirst: true,
    },
    {
        accessorKey: "id_grupo_economico",
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
        accessorKey: "tmanho",
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