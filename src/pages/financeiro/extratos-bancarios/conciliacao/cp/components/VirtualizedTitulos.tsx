import * as React from "react";

import FormInput, { Input } from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import { InputDate } from "@/components/custom/InputDate";
import { normalizeCurrency } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TitulosConciliarProps } from "../tables/TitulosConciliar";

interface VirtualizerVencimentosProps {
  data: TitulosConciliarProps[];
  form: any;
  canEdit: boolean;
}

const VirtualizedTitulos: React.FC<VirtualizerVencimentosProps> = ({
  data,
  form,
  canEdit,
}) => {
  const parentElement = React.useRef(null);

  const count = data.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  return (
    <section
      ref={parentElement}
      className="h-[52vh] w-full overflow-auto scroll-thin"
    >
      <div className="flex gap-1 font-medium text-xs  w-full sticky top-0 z-10 bg-background">
        <p className="min-w-20 text-center bg-background">ID Título</p>
        <p className="min-w-36 pl-2 bg-background">Descrição</p>
        <p className="min-w-36 pl-2 bg-background">Fornecedor</p>
        <p className="min-w-28 pl-2 bg-background">Valor</p>
        <p className="min-w-36 pl-2 bg-background">Filial</p>
        <p className="min-w-32 text-center bg-background">Tipo Baixa</p>
        <p className="min-w-28 pl-2 bg-background">Valor Pago</p>
        {!canEdit && (
          <p className="min-w-44 pl-2 bg-background">Data Prevista</p>
        )}
      </div>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item, index) => {
          const tipo = form.watch(`titulos.${item.index}.tipo_baixa`);
          const valor = parseFloat(data[item.index].valor);
          type TipoBaixaProps = {
            id: number | string;
            label: string;
          };
          const tipoBaixa: TipoBaixaProps[] = [
            { id: "PADRÃO", label: "Total" },
            { id: "PARCIAL", label: "Parcial" },
            { id: "COM DESCONTO", label: "Com Desconto" },
            { id: "COM ACRÉSCIMO", label: "Com Acréscimo" },
          ];

          // console.log(
          //   form.formState.errors &&
          //     form.formState.errors.titulos &&
          //     form.formState.errors.titulos[item.index],
          //   item.index
          // );

          return (
            <div
              // ref={virtualizer.measureElement}
              key={item.index}
              data-index={index}
              className={`flex w-full gap-1 py-1 px-1 items-center text-xs ${
                virtualizer.getVirtualItems().length == 0 && "hidden"
              }`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${item.size}px`,
                transform: `translateY(${item.start}px)`,
              }}
            >
              <Input
                className="text-xs w-20 h-8 p-2 text-center"
                value={data[item.index].id_titulo || ""}
                readOnly={true}
              />
              <Input
                className="text-xs min-w-36 h-8 p-2"
                value={data[item.index].descricao}
                readOnly={true}
              />
              <Input
                className="text-xs min-w-36 h-8 p-2"
                value={data[item.index].nome_fornecedor}
                readOnly={true}
              />
              <Input
                className="text-xs w-28 h-8 p-2 center"
                value={
                  data[item.index].valor &&
                  normalizeCurrency(data[item.index].valor)
                }
                readOnly={true}
              />
              <Input
                className="text-xs min-w-36 h-8 p-2"
                value={data[item.index].filial}
                readOnly={true}
              />
              <FormSelect
                name={`titulos.${item.index}.tipo_baixa`}
                className="text-xs w-32 h-8"
                control={form.control}
                disabled={canEdit}
                options={tipoBaixa.map((tipo_baixa: TipoBaixaProps) => ({
                  value: tipo_baixa.id.toString(),
                  label: tipo_baixa.label,
                }))}
                onChange={() =>
                  form.setValue(`titulos.${item.index}.valor_pago`, valor)
                }
              />
              <FormInput
                type="number"
                inputClass="text-xs flex-1 w-28 h-8"
                readOnly={tipo == "PADRÃO" || canEdit}
                name={`titulos.${item.index}.valor_pago`}
                control={form.control}
                min={tipo === "COM ACRÉSCIMO" ? valor : 0}
                max={tipo !== "COM ACRÉSCIMO" ? valor : valor * 1000}
              />
              {!canEdit && (
                <InputDate
                  disabled={tipo !== "PARCIAL"}
                  className={`h-8 min-w-44 ${
                    form.formState.errors &&
                    form.formState.errors.titulos &&
                    form.formState.errors.titulos[item.index] &&
                    "border border-red-600"
                  }`}
                  value={form.watch(`titulos.${item.index}.data_prevista`)}
                  onChange={(e: Date) =>
                    form.setValue(`titulos.${item.index}.data_prevista`, e)
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VirtualizedTitulos;
