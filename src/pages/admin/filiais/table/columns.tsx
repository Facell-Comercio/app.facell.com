

import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react"
import { useStoreFilial } from "../filial/store"
import { FileSearch } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowUsers = {
  select: ReactNode
  id: string
  img_url?: string
  nome: string
}

const openModal = useStoreFilial.getState().openModal

export const columnsTable: ColumnDef<RowUsers>[] = [
  {
    accessorKey: "id",
    header: "AÇÃO",
    enableSorting: false,
    cell: (info) => (
      <span className='font-semibold cursor-pointer text-blue-500' onClick={() => openModal(info.getValue<number>().toString())}>{<FileSearch />}</span>
    ),
    sortDescFirst: true,
  },
  {
    header: "NOME",
    accessorKey: "nome",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{nome}</span>;
    },
  },
  {
    header: "CNPJ",
    accessorKey: "cnpj",
    cell: (info) => {
      return <span>{info.getValue<string>()}</span>;
    },
  },
  {
    header: "GRUPO",
    accessorKey: "grupo_economico",
    cell: (info) => {
      return <span>{info.getValue<string>()}</span>;
    },
  },
]
