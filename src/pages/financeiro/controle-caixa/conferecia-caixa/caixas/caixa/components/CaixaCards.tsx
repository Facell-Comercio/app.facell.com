import { Input } from "@/components/custom/FormInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeCurrency, normalizeNumberOnly } from "@/helpers/mask";
import { ConferenciasCaixaSchema } from "@/hooks/financeiro/useConferenciasCaixa";

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
          value: normalizeCurrency(data.valor_retiradas),
          label: "Retiradas",
        },
        {
          value: normalizeCurrency(data.total_dinheiro),
          label: "Total",
        },
      ],
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
    },
  ];
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {objs.map((obj, index: number) => (
        <CaixaCardComponent key={`${index} - ${obj.title}`} {...obj} />
      ))}
    </section>
  );
};

const CaixaCardComponent = ({
  title,
  valuesList,
}: {
  title: string;
  valuesList: { value: string; label: string }[];
}) => {
  const hasDivergence = valuesList.some(
    (value) =>
      value.label === "Divergência" &&
      parseFloat(normalizeNumberOnly(value.value)) > 0
  );
  return (
    <Card
      className={`bg-slate-200 dark:bg-blue-950 ${
        hasDivergence && "dark:bg-red-800/80"
      }`}
    >
      <CardHeader className="flex items-center justify-center p-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-3">
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
  const isDivergencia =
    (label === "Divergência" || label === "Retiradas") &&
    parseFloat(normalizeNumberOnly(value)) > 0;
  return (
    <span className="flex gap-2 items-center">
      <label className="font-medium text-sm min-w-24">{label}</label>
      <Input
        value={value}
        readOnly
        className={`h-8 ${isDivergencia && "text-red-400"}`}
      />
    </span>
  );
};

export default CaixaCards;
