import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";
import { CircleX } from "lucide-react";

export type RowConcederVenderFardamento = {
  select: ReactNode;
  id: string;
  grupo_economico: string;
  uf: string;
  modelo: string;
  tamanho: string;
  sexo: string;
};
export const columnsTableConcederVenderFardamento: ColumnDef<RowConcederVenderFardamento>[] =
  [
    {
      accessorKey: "id",
      header: "AÇÕES",
      enableSorting: false,
      cell: () => (
        <span>
          <Button variant={"destructive"} size={"xs"}>
            <CircleX/>
            <span> Excluir </span>
          </Button>
        </span>
      ),
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
      accessorKey: "qtde",
      header: "QTDE",
    },
    {
      accessorKey: "preco",
      header: "VALOR"
    },
  ];
