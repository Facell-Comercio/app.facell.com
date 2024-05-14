import * as React from "react";

import FormInput, { Input } from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import { normalizeCurrency } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TitulosConciliarProps } from "../tables/TitulosConciliar";

interface VirtualizerTitulosProps {
  data: TitulosConciliarProps[];
  form: any;
  canEdit: boolean;
}

const VirtualizedTitulos: React.FC<VirtualizerTitulosProps> = ({
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
    <section className=" overflow-auto scroll-thin ">
      <div className="flex gap-1 font-medium text-xs px-1 w-full sticky top-0 z-10">
        <p className="min-w-16 text-center">ID</p>
        <p className="min-w-64">Descrição</p>
        <p className="min-w-64">Fornecedor</p>
        <p className="min-w-32 text-center">Valor</p>
        <p className="min-w-64">Filial</p>
        <p className="min-w-36 text-center">Tipo Baixa</p>
        <p className="min-w-32 text-center">Valor Pago</p>
      </div>
      <div
        ref={parentElement}
        className="pe-2 h-[400px] w-full border-green-500"
      >
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
            // React.useEffect(() => {
            //   form.setValue(`titulos.${item.index}.valor_pago`, valor);
            // }, [tipo]);

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
                  className="text-xs w-16 h-8 p-2 text-center"
                  value={data[item.index].id_titulo || ""}
                  readOnly={true}
                />
                <Input
                  className="text-xs min-w-64 h-8 p-2"
                  value={data[item.index].descricao}
                  readOnly={true}
                />
                <Input
                  className="text-xs min-w-64 h-8 p-2"
                  value={data[item.index].nome_fornecedor}
                  readOnly={true}
                />
                <Input
                  className="text-xs w-32 h-8 p-2 center"
                  value={
                    data[item.index].valor &&
                    normalizeCurrency(data[item.index].valor)
                  }
                  readOnly={true}
                />
                <Input
                  className="text-xs min-w-64 h-8 p-2"
                  value={data[item.index].filial}
                  readOnly={true}
                />
                <FormSelect
                  name={`titulos.${item.index}.tipo_baixa`}
                  className="text-xs w-36 h-8"
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
                  inputClass="text-xs flex-1 w-32 h-8"
                  readOnly={tipo == "PADRÃO" || canEdit}
                  name={`titulos.${item.index}.valor_pago`}
                  control={form.control}
                  min={tipo === "COM ACRÉSCIMO" ? valor : 0}
                  max={tipo !== "COM ACRÉSCIMO" ? valor : valor * 1000}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VirtualizedTitulos;
