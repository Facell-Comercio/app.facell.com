import { normalizeDate, normalizeFirstAndLastName } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
// import { useStoreCliente } from "../cliente/store";
// import { useStoreClientes } from "../orcamento/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ClienteProps = {
  gsm: string;
  gsm_portado: string;
  cpf: string;
  data_ultima_compra: string;
  plano_habilitado: string;
  produto_ultima_compra: string;
  desconto_plano: string;
  valor_caixa: string;
  filial: string;
  uf: string;
  status_plano: string;
  fidelizacao1: string;
  data_fidelizacao_fid1: string;
  fidelizacao2: string;
  data_fidelizacao_fid2: string;
  fidelizacao3: string;
  data_fidelizacao_fid3: string;
  cliente: string;
  codigo: string;
  plano_atual: string;
  fidelizado_aparelho: string;
  produto_ofertado: string;
  vendedor: string;
};

// ^ Realizar a filtragem dinâmica para a apresentação do grupo econômico ++ Liberar ou não a visualização para o usuário dependendo da quantidade de centro de custos dele

export const columnsTableClientes: ColumnDef<ClienteProps>[] = [
  {
    accessorKey: "gsm",
    header: "GSM",
    size: 100,
  },
  {
    accessorKey: "gsm_portado",
    header: "GSM PORTADO",
    size: 100,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase">{label || "- "}</div>;
    },
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    size: 100,
  },
  {
    accessorKey: "cliente",
    header: "NOME",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase">{normalizeFirstAndLastName(label)}</div>;
    },
  },
  {
    accessorKey: "plano_habilitado",
    header: "DATA ÚLTIMA COMPRA",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{label}</div>;
    },
  },
  {
    accessorKey: "data_ultima_compra",
    header: "DATA ÚLTIMA COMPRA",
    size: 150,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase">{normalizeDate(label)}</div>;
    },
  },
];
