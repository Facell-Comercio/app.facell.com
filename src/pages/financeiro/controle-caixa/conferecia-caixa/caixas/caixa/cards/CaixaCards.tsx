import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeCurrency, normalizeNumberOnly } from "@/helpers/mask";
import {
  ConferenciasCaixaSchema,
  MovimentoCaixaProps,
} from "@/hooks/financeiro/useConferenciasCaixa";
import {
  ArrowUpDown,
  Banknote,
  CreditCard,
  HandCoins,
  Landmark,
  List,
  Shield,
} from "lucide-react";
import { useStoreCaixa } from "../store";
import ModalDetalheCard from "./ModalDetalheCard";

export type ColumnsDetalheProps = {
  label: string;
  type: string;
  format?: string;
};

export interface CaixaCardDetalheProps {
  movimento_caixa: MovimentoCaixaProps[];
  columns: ColumnsDetalheProps[];
  dadosReais: Object[];
}

const CaixaCards = ({ data }: { data: ConferenciasCaixaSchema }) => {
  const objs = [
    {
      title: "Dinheiro",
      valuesList: [
        {
          value: normalizeCurrency(data.valor_dinheiro),
          label: "Dinheiro",
        },
        {
          value: normalizeCurrency(
            -Math.abs(parseFloat(data.valor_retiradas || "0"))
          ),
          label: "Retiradas",
        },
        {
          value: normalizeCurrency(data.total_dinheiro),
          label: "Total",
        },
        {
          value: normalizeCurrency(
            -Math.abs(parseFloat(data.valor_devolucoes || "0"))
          ),
          label: "Devoluções",
        },
      ],
      icon: Banknote,
    },
    {
      title: "Cartão",
      valuesList: [
        {
          value: normalizeCurrency(data.valor_cartao),
          label: "Venda",
        },
        {
          value: normalizeCurrency(data.valor_cartao_real),
          label: "Real",
        },
        {
          value: normalizeCurrency(data.divergencia_cartao),
          label: "Divergência",
        },
      ],
      type: "cartao",
      icon: CreditCard,
    },

    {
      title: "Recarga",
      valuesList: [
        {
          value: normalizeCurrency(data.valor_recarga),
          label: "Venda",
        },
        {
          value: normalizeCurrency(data.valor_recarga_real),
          label: "Real",
        },
        {
          value: normalizeCurrency(data.divergencia_recarga),
          label: "Divergência",
        },
      ],
      type: "recarga",
      icon: HandCoins,
    },
    {
      title: "Pitzi",
      valuesList: [
        {
          value: normalizeCurrency(data.valor_pitzi),
          label: "Venda",
        },
        {
          value: normalizeCurrency(data.valor_pitzi_real),
          label: "Real",
        },
        {
          value: normalizeCurrency(data.divergencia_pitzi),
          label: "Divergência",
        },
      ],
      type: "pitzi",
      icon: Shield,
    },
    {
      title: "PIX",
      valuesList: [
        {
          value: normalizeCurrency(data.valor_pix),
          label: "Venda",
        },
        {
          value: normalizeCurrency(data.valor_pix_banco),
          label: "Real",
        },
        {
          value: normalizeCurrency(data.divergencia_pix),
          label: "Divergência",
        },
      ],
      type: "pix",
      icon: Landmark,
    },
    {
      title: "Tradein",
      valuesList: [
        {
          value: normalizeCurrency(data.valor_tradein),
          label: "Venda",
        },
        {
          value: normalizeCurrency(data.valor_tradein_utilizado),
          label: "Utilizado",
        },
        {
          value: normalizeCurrency(data.divergencia_tradein),
          label: "Divergência",
        },
      ],
      type: "tradein",
      icon: ArrowUpDown,
    },
    {
      title: "Crediário",
      valuesList: [
        {
          value: normalizeCurrency(data.valor_crediario),
          label: "Venda",
        },
        {
          value: normalizeCurrency(data.valor_crediario_real),
          label: "Real",
        },
        {
          value: normalizeCurrency(data.divergencia_crediario),
          label: "Divergência",
        },
      ],
      // type: "crediario",
      icon: ArrowUpDown,
    },
  ];
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  last:lg:grid-cols-2 last-child:bg-green-500 gap-3">
      {objs.map((obj, index: number) => (
        <CaixaCardComponent
          key={`${index} - ${obj.title}`}
          title={obj.title}
          valuesList={obj.valuesList}
          type={obj.type}
          icon={obj.icon}
        />
      ))}
      <ModalDetalheCard />
    </section>
  );
};

type valuesListProps = {
  value: string;
  label: string;
};

const CaixaCardComponent = ({
  title,
  valuesList,
  type,
  icon: Icon,
}: {
  title: string;
  valuesList: valuesListProps[];
  type?: string;
  icon?: React.ElementType;
}) => {
  const hasDivergence = valuesList.some(
    (value) =>
      value.label === "Divergência" &&
      parseFloat(normalizeNumberOnly(value.value)) > 0
  );
  const openModal = useStoreCaixa().openModalDetalheCard;
  return (
    <Card
      className={` bg-slate-200 dark:bg-blue-950 ${
        hasDivergence && "bg-red-500 text-white dark:bg-red-800/80"
      } sm:last:col-span-2 lg:last:col-span-1 lg:last:col-start-2`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-3">
        <span className="flex gap-3 items-center">
          {Icon && <Icon size={24} />}
          <CardTitle>{title}</CardTitle>
        </span>
        {type && (
          <Button
            size={"xs"}
            variant={"outline"}
            className="text-foreground"
            onClick={() => openModal({ type, title })}
          >
            <List size={16} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-1 p-3">
        {valuesList.map((value, index) => (
          <CaixaCardComponentValue key={index} {...value} />
        ))}
      </CardContent>
    </Card>
  );
};

const CaixaCardComponentValue = ({
  label,
  value,
}: {
  value: string;
  label: string;
}) => {
  const isNegative = value.includes("-");
  return (
    <span className="flex gap-2 items-center">
      <label className="font-medium text-sm min-w-24">{label}</label>
      <Input
        value={value}
        readOnly
        className={`h-8 text-foreground ${isNegative && "text-red-400"}`}
      />
    </span>
  );
};

export default CaixaCards;