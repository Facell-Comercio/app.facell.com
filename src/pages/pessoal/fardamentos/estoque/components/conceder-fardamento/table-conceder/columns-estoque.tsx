import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";
import { CircleX } from "lucide-react";
import { ItemConcessaoVendaFardamento, useStoreConcederVenderFardamento } from "../Store";

export type RowConcederVenderFardamento = {
  select: ReactNode;
}&ItemConcessaoVendaFardamento;
export const columnsTableConcederVenderFardamento: ColumnDef<ItemConcessaoVendaFardamento>[] =
  [
    {
      accessorKey: "id",
      header: "AÇÕES",
      enableSorting: false,
      cell: ({ row }) => {
        const deletItem = useStoreConcederVenderFardamento((state) => state.deletItem);
        return (
         <span>
           <Button 
             variant={"destructive"} 
             size={"xs"}
             onClick={() => deletItem(row.original.id)}>
              <CircleX size={18}/>
              <span className="ml-1 font-bold"> Excluir </span>
          </Button>
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
      accessorKey: "qtde",
      header: "QTDE",
      cell: ({ row }) => {
        const incrementQtde = useStoreConcederVenderFardamento((state) => state.incrementQtde);
        const decrementQtde = useStoreConcederVenderFardamento((state) => state.decrementQtde);
        return (
          <div className="flex items-center space-x-2">
            <Button variant={"secondary"} size={"xs"} onClick={() => decrementQtde(row.original.id)}>
              -
            </Button>
            <span>{row.original.qtde}</span>
            <Button variant={"secondary"} size={"xs"} onClick={() => incrementQtde(row.original.id)}>
              +
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "preco",
      header: "VALOR"
    },
  ];
