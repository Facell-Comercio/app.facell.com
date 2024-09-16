import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeCurrency, normalizeNumberOnly } from "@/helpers/mask";
import {
  ConferenciasCaixaSchema,
  MovimentoCaixaProps,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { ArrowUpDown, Banknote, CreditCard, HandCoins, Landmark, List, Shield } from "lucide-react";
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
          value: normalizeCurrency(-Math.abs(parseFloat(data.valor_devolucoes || "0"))),
          label: "Devoluções",
          groupName: "outro",
        },
        {
          value: normalizeCurrency(data.valor_dinheiro),
          label: "Entrada",
          groupName: "entrada",
        },
        {
          value: normalizeCurrency(data.valor_dinheiro),
          label: "Despesas",
          groupName: "saida",
        },
        {
          value: normalizeCurrency(-Math.abs(parseFloat(data.valor_retiradas || "0"))),
          label: "Depósitos",
          groupName: "saida",
        },
        {
          value: normalizeCurrency(data.valor_dinheiro),
          label: "Boletos",
          groupName: "saida",
        },
        {
          value: normalizeCurrency(data.total_dinheiro),
          label: "Saldo",
          groupName: "saldo",
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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 last:lg:grid-cols-2 last-child:bg-green-500 gap-3">
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
    (value) => value.label === "Divergência" && parseFloat(normalizeNumberOnly(value.value)) > 0
  );

  const isDinheiro = title === "Dinheiro";
  const isTradein = title === "Tradein";

  const groupedData = Object.values(
    valuesList.reduce((acc: any, item: any) => {
      // Verifica se o grupo já existe no acumulador
      if (!acc[item.groupName]) {
        acc[item.groupName] = [];
      }
      // Adiciona o item ao grupo correspondente
      acc[item.groupName].push(item);
      return acc;
    }, {})
  ); // Converte o objeto de grupos em um array de arrays

  const openModal = useStoreCaixa().openModalDetalheCard;
  return (
    <Card
      className={` bg-slate-200 dark:bg-blue-950 ${
        hasDivergence && "bg-red-500 text-white dark:bg-red-800/80"
      }  ${isDinheiro && "row-span-2 "} ${isTradein && "col-start-2"} `}
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
      <CardContent className={`flex justify-between flex-col p-0`}>
        {groupedData.map((group: any, groupIndex) => {
          return (
            <div className="flex flex-col gap-1 p-3">
              {group[0].groupName === "saida" && (
                <span>
                  <p className="text-sm font-medium">Saídas:</p>
                  <hr className={"my-1 border-slate-900 dark:border-blue-750"} />
                </span>
              )}
              {group.map((value: any, valueIndex: number) => (
                <CaixaCardComponentValue key={`${groupIndex}-${valueIndex}`} {...value} />
              ))}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

const CaixaCardComponentValue = ({ label, value }: { value: string; label: string }) => {
  const isNegative = value.includes("-");

  return (
    <span className={`flex gap-1 items-center `}>
      <label className="font-medium text-sm min-w-24">{label}</label>
      <Input
        value={value}
        readOnly
        className={`h-8 text-foreground ${isNegative && "text-red-400"}`}
      />
      {(label === "Entrada" || label === "Despesas") && (
        <Button size={"xs"} className="h-8" variant={"outline"}>
          <List size={16} />
        </Button>
      )}
    </span>
  );
};

export default CaixaCards;
