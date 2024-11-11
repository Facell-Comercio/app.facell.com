import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { RecebimentoProps } from "@/hooks/financeiro/useTituloReceber";
import { ColumnDef } from "@tanstack/react-table";
import { useStoreTituloReceber } from "../../titulos/titulo/store";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const openModalTitulo = useStoreTituloReceber.getState().openModal;

export const columnsTable: ColumnDef<RecebimentoProps>[] = [
  {
    id: "id_titulo",
    header: "ID TÍTULO",
    accessorKey: "id_titulo",
    cell: (info) => {
      const id = info.getValue<number>().toString();
      return (
        <span
          title="Ver Título"
          className="flex items-center justify-center w-full text-primary font-semibold truncate max-w-96 cursor-pointer"
          onClick={() => openModalTitulo({ id })}
        >
          {id}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "data",
    header: "PAGAMENTO",
    accessorKey: "data",
    cell: (info) => {
      const data = normalizeDate(info.getValue<Date>()) || "";
      return (
        <span title={data} className="block truncate max-w-96">
          {data}
        </span>
      );
    },
  },
  {
    id: "valor",
    header: "VALOR",
    accessorKey: "valor",
    cell: (info) => {
      const label = normalizeCurrency(info.getValue<string>());
      return (
        <span title={label} className="block text-right text-nowrap">
          {label}
        </span>
      );
    },
  },

  {
    id: "num_doc",
    header: "DOC",
    accessorKey: "num_doc",
    cell: (info) => {
      const label = info.getValue<string>();
      return <div title={label}>{label}</div>;
    },
    enableSorting: false,
  },
  {
    id: "conta_bancaria",
    header: "CONTA BANCÁRIA",
    accessorKey: "conta_bancaria",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
  {
    id: "fornecedor",
    header: "FORNECEDOR",
    accessorKey: "fornecedor",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
  {
    id: "filial",
    accessorKey: "filial",
    header: "FILIAL",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
  {
    id: "descricao",
    accessorKey: "descricao",
    header: "DESCRIÇÃO",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
];
