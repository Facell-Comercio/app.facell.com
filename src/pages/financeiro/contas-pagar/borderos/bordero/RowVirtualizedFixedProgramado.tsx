import * as React from "react";

import { Input } from "@/components/custom/FormInput";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { VencimentosProps } from "@/pages/financeiro/components/ModalVencimentos";
import { useVirtualizer } from "@tanstack/react-virtual";

interface RowVirtualizerFixedProgramadoProps {
  data: VencimentosProps[];
  filteredData: VencimentosProps[];
  form: any;
  removeItem: (index: number, id?: string, id_status?: string) => void;
  modalEditing: boolean;
}

const RowVirtualizerFixedProgramado: React.FC<
  RowVirtualizerFixedProgramadoProps
> = ({ data, filteredData }) => {
  const parentElement = React.useRef(null);

  const count = filteredData.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  return (
    <section
      ref={parentElement}
      className="pe-2 h-[300px] w-full overflow-auto scroll-thin"
      // style={{
      //   height: `300px`,
      //   width: `100%`,
      //   overflow: 'auto',
      // }}
    >
      <div className="flex gap-1 font-medium text-sm w-full sticky top-0 z-10 bg-slate-200 dark:bg-blue-950 px-1">
        <p className="min-w-16 text-center bg-slate-200 dark:bg-blue-950">ID</p>
        <p className="min-w-[72px] text-center bg-slate-200 dark:bg-blue-950">
          ID Título
        </p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">
          Previsto
        </p>
        <p className="flex-1 min-w-36 bg-slate-200 dark:bg-blue-950 text-center">
          Forma Pagamento
        </p>
        <p className="flex-1 min-w-44 bg-slate-200 dark:bg-blue-950">
          Fornecedor
        </p>
        <p className="flex-1 min-w-32 bg-slate-200 dark:bg-blue-950">Filial</p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">
          Nº Doc
        </p>

        <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">
          Valor
        </p>
        {/* <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">
          Valor Pago
        </p>
        <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">
          Tipo Baixa
        </p>
        <p className="min-w-56 text-center bg-slate-200 dark:bg-blue-950">
          Observação
        </p> */}
      </div>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item, index) => {
          const indexData = data.findIndex(
            (vencimento) =>
              vencimento.id_vencimento ===
              filteredData[item.index].id_vencimento
          );

          return (
            <div
              // ref={virtualizer.measureElement}
              key={indexData}
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
                className="w-16 h-8 text-xs p-2 text-center"
                value={data[indexData].id_vencimento || ""}
                readOnly
              />
              <Input
                className="w-[72px] h-8 text-xs p-2 text-center"
                value={data[indexData].id_titulo || ""}
                readOnly
              />
              <Input
                className="w-24 h-8 text-xs p-2 text-center"
                value={
                  data[indexData].previsao &&
                  normalizeDate(data[indexData].previsao || "")
                }
                readOnly
              />
              <Input
                className="flex-1 w-36 h-8 text-xs p-2 text-center"
                value={data[indexData].forma_pagamento || ""}
                readOnly
              />
              <Input
                className="min-w-44 flex-1 h-8 text-xs p-2"
                value={data[indexData].nome_fornecedor || ""}
                readOnly
              />
              <Input
                className="flex-1 min-w-32 h-8 text-xs p-2"
                value={data[indexData].filial || ""}
                readOnly
              />
              <Input
                className="w-24 h-8 text-xs p-2 text-center"
                value={data[indexData].num_doc || ""}
                readOnly
              />
              <Input
                className="w-32 h-8 text-xs p-2 text-end"
                value={
                  data[indexData].valor_total &&
                  normalizeCurrency(data[indexData].valor_total)
                }
                readOnly
              />
              {/* <Input
                className="w-32 h-8 text-xs p-2 text-end"
                value={normalizeCurrency(data[indexData].valor_pago || 0)}
                readOnly
              />
              <Input
                className="w-32 h-8 text-xs p-2 text-center"
                value={data[indexData].tipo_baixa || ""}
                readOnly
              />
              <Input
                className="min-w-56 h-8 text-xs p-2 uppercase"
                value={data[indexData].obs || ""}
                readOnly
              /> */}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RowVirtualizerFixedProgramado;
