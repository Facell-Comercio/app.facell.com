import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { useStorePoliticas } from "./store-politicas";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowPolitica = {
  id: string;
  ref: string;
  descricao: string;
};

const setIdPolitica =
  useStorePoliticas.getState().setIdPolitica;
const closeModal =
  useStorePoliticas.getState().closeModal;

export const columnsTable: ColumnDef<RowPolitica>[] =
  [
    {
      accessorKey: "ref",
      header: "REFERÊNCIA",
      cell: (info) => {
        const label =
          info.getValue<string>() &&
          formatDate(
            info.getValue<string>(),
            "MM/yyyy"
          );
        return (
          <div
            className="font-semibold cursor-pointer text-blue-500 rounded-lg"
            onClick={() => {
              setIdPolitica(info.row.original.id);
              closeModal();
            }}
          >
            {label}
          </div>
        );
      },
      size: 30,
      enableSorting: false,
    },
    {
      header: "Descrição",
      accessorKey: "descricao",
      cell: (info) => {
        const label = info.getValue<string>();
        return (
          <div
            title={label}
            className="block max-w-96 truncate uppercase text-wrap"
          >
            {label}
          </div>
        );
      },
    },
  ];
