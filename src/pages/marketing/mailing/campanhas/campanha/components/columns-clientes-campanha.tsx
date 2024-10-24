import { Button } from "@/components/ui/button";
import { normalizeCurrency, normalizeDate, normalizeFirstAndLastName } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pen } from "lucide-react";
import { useStoreCampanha } from "../store";
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

const openModalEditarCliente = useStoreCampanha.getState().openModalEditarCliente;
const openModalVerCliente = useStoreCampanha.getState().openModalVerCliente;

export const columnsTableClientesSubcampanha: ColumnDef<ClienteProps>[] = [
  {
    accessorKey: "id",
    header: "AÇÕES",
    size: 80,
    cell: (info) => {
      const id = info.getValue<string>();

      return (
        <div className="flex gap-2 uppercase">
          <Button
            size={"xs"}
            variant={"warning"}
            onClick={() => {
              openModalEditarCliente(id);
            }}
          >
            <Pen size={16} />
          </Button>
          <Button size={"xs"} onClick={() => openModalVerCliente(id)}>
            <Eye size={16} />
          </Button>
        </div>
      );
    },
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
    accessorKey: "gsm",
    header: "GSM",
    size: 100,
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    size: 100,
  },
  {
    accessorKey: "uf",
    header: "UF",
    size: 50,
  },
  {
    accessorKey: "filial",
    header: "FILIAL",
    size: 150,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase">{label || "- "}</div>;
    },
  },
  {
    accessorKey: "data_ultima_compra",
    header: "DATA ÚLTIMA COMPRA",
    size: 150,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase">{normalizeDate(label || "")}</div>;
    },
  },
  {
    accessorKey: "produto_ultima_compra",
    header: "PRODUTO ÚLTIMA COMPRA",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{label}</div>;
    },
  },
  {
    accessorKey: "desconto_plano",
    header: "DESCONTO ÚLTIMA COMPRA",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{normalizeCurrency(label)}</div>;
    },
  },
  {
    accessorKey: "valor_caixa",
    header: "VALOR CAIXA",
    size: 120,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{normalizeCurrency(label)}</div>;
    },
  },
  {
    accessorKey: "plano_atual",
    header: "PLANO HABILITADO",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{label || "-"}</div>;
    },
  },
  {
    accessorKey: "status_plano",
    header: "STATUS PLANO",
    size: 100,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{label || "-"}</div>;
    },
  },
  {
    accessorKey: "fidelizacao_1",
    header: "FIDELIZAÇÃO 1",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{label || "-"}</div>;
    },
  },
  {
    accessorKey: "fidelizacao_2",
    header: "FIDELIZAÇÃO 2",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{label || "-"}</div>;
    },
  },
  {
    accessorKey: "fidelizacao_3",
    header: "FIDELIZAÇÃO 3",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{label || "-"}</div>;
    },
  },
  {
    accessorKey: "produto_fidelizado",
    header: "PRODUTO FIDELIZADO",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{label || "-"}</div>;
    },
  },
  {
    accessorKey: "tim_data_consulta",
    header: "DATA ÚLTIMA CONSULTA",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase">{normalizeDate(label || "") || "-"}</div>;
    },
  },
  {
    accessorKey: "produto_ofertado",
    header: "PRODUTO OFERTADO",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{label || "-"}</div>;
    },
  },
  // {
  //   accessorKey: "valor_pre",
  //   header: "VALOR PRE",
  //   size: 120,
  //   cell: (info) => {
  //     const label = info.getValue<string>();
  //     return <div className="uppercase truncate">{normalizeCurrency(label)}</div>;
  //   },
  // },
  // {
  //   accessorKey: "valor_plano",
  //   header: "VALOR PLANO",
  //   size: 120,
  //   cell: (info) => {
  //     const label = info.getValue<string>();
  //     return <div className="uppercase truncate">{normalizeCurrency(label)}</div>;
  //   },
  // },
  // {
  //   accessorKey: "desconto",
  //   header: "DESCONTO",
  //   size: 120,
  //   cell: (info) => {
  //     const label = info.getValue<string>();
  //     return <div className="uppercase truncate">{normalizeCurrency(label)}</div>;
  //   },
  // },
  {
    accessorKey: "vendedor",
    header: "ATENDENTE/VENDEDOR",
    size: 200,
    cell: (info) => {
      const label = info.getValue<string>();
      return <div className="uppercase truncate">{label || "-"}</div>;
    },
  },
];
