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
  data_compra: string;
  plano_habilitado: string;
  produto_compra: string;
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
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label || "-"}</span>;
    },
  },
  {
    header: "GSM PORTADO",
    accessorKey: "gsm_portado",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label || "-"}</span>;
    },
  },
  {
    header: "CPF DO CLIENTE",
    accessorKey: "cpf_cliente",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span title={label}>{label}</span>;
    },
  },
  {
    header: "DATA DA COMPRA",
    accessorKey: "data_compra",
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
    header: "GRUPO ESTOQUE",
    accessorKey: "grupo_estoque",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase text-nowrap">{label}</span>;
    },
  },
  {
    header: "DESCRICÃO PRODUTO",
    accessorKey: "produto_compra",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase min-w-[100ch]">{label}</span>;
    },
  },
  {
    header: "FORNECEDOR",
    accessorKey: "fornecedor",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label || "-"}</span>;
    },
  },
  {
    header: "FABRICANTE",
    accessorKey: "fabricante",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label || "-"}</span>;
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
      return <span className="uppercase text-nowrap">{label}</span>;
    },
  },
  {
    header: "ESTADO",
    accessorKey: "uf",
  },
  {
    header: "FIDELIZAÇÃO APARELHO",
    accessorKey: "fid_aparelho",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <span className={`uppercase ${label === "SIM" ? "text-green-500" : "text-red-500"}`}>
          {label}
        </span>
      );
    },
  },
  {
    header: "FIDELIZAÇÃO PLANO",
    accessorKey: "fid_plano",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <span
          className={`uppercase ${label === "SIM" && "text-green-500"} ${
            label === "NÃO" && "text-red-500"
          }`}
        >
          {label || "-"}
        </span>
      );
    },
  },
  {
    header: "STATUS PLANO",
    accessorKey: "status_plano",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className={"uppercase"}>{label}</span>;
    },
  },
];
