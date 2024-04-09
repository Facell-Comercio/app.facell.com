import { ColumnDef } from "@tanstack/react-table"
import { FileSearch } from "lucide-react"
import { useStoreGrupoEconomico } from "../grupo-economico/store"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowUsers = {
  id: string
  nome: string
}

const openModal = useStoreGrupoEconomico.getState().openModal

export const columns: ColumnDef<RowUsers>[] = [
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
    header: "MATRIZ",
    accessorKey: "matriz",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{nome}</span>;
    },
  },
]
