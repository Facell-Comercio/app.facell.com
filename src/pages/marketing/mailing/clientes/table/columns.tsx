import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
// import { useStoreCliente } from "../cliente/store";
// import { useStoreClientes } from "../orcamento/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowClientes = {
  id: string;
  gsm: string;
  gsm_portado: string | null;
  cpf: string;
  data_ultima_compra: string;
  plano_habilitado: string;
  produto_ultima_compra: string;
  desconto_plano: string;
  valor_caixa: string;
  filial: string;
  area: string;
};

// const openModal = useStoreCliente.getState().openModal;

// ^ Realizar a filtragem dinâmica para a apresentação do grupo econômico ++ Liberar ou não a visualização para o usuário dependendo da quantidade de centro de custos dele

export const columnsTable: ColumnDef<RowClientes>[] = [
  {
    header: "GSM DO CLIENTE",
    accessorKey: "gsm",
  },
  {
    header: "GSM PORTADO",
    accessorKey: "gsm_portado",
  },
  {
    header: "CPF DO CLIENTE",
    accessorKey: "cpf",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span title={label}>{label}</span>;
    },
  },
  {
    header: "DATA DA COMPRA",
    accessorKey: "data_ultima_compra",
    cell: (info) => {
      const label = normalizeDate(info.getValue<string>());
      return <span title={label}>{label}</span>;
    },
  },
  {
    header: "PLANO HABILITADO",
    accessorKey: "plano_habilitado",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label}</span>;
    },
  },
  {
    header: "DESCRICÃO PRODUTO",
    accessorKey: "produto_ultima_compra",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label}</span>;
    },
  },
  {
    header: "DESCONTO RECEBIDO",
    accessorKey: "desconto_plano",
    cell: (info) => {
      const label = normalizeCurrency(info.getValue<string>());
      return <span>{label}</span>;
    },
  },
  {
    header: "VALOR CAIXA",
    accessorKey: "valor_caixa",
    cell: (info) => {
      const label = normalizeCurrency(info.getValue<string>());
      return <span>{label}</span>;
    },
  },
  {
    header: "FILIAL",
    accessorKey: "filial",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label}</span>;
    },
  },
  {
    header: "ESTADO",
    accessorKey: "area",
  },
];
