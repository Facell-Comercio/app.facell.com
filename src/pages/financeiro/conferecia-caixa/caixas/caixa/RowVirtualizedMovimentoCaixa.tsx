import * as React from "react";

import { normalizeCurrency } from "@/helpers/mask";
import { MovimentoCaixaProps } from "@/hooks/financeiro/useConferenciasCaixa";
import { useVirtualizer } from "@tanstack/react-virtual";
import { formatDate } from "date-fns";

interface RowVirtualizedFixedMovimentoCaixaProps {
  data: MovimentoCaixaProps[];
}

const RowVirtualizedFixedMovimentoCaixa: React.FC<
  RowVirtualizedFixedMovimentoCaixaProps
> = ({ data }) => {
  const parentElement = React.useRef(null);

  const count = data.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  const gridClass =
    "grid-cols-[minmax(20ch,_1fr)_minmax(20ch,_1fr)_minmax(20ch,_1fr)_minmax(20ch,_1fr)_minmax(20ch,_1fr)_minmax(20ch,_1fr)]";
  return (
    <div
      ref={parentElement}
      className="pe-1 max-h-[200px] w-full overflow-auto scroll-thin"
      // style={{
      //   height: `300px`,
      //   width: `100%`,
      //   overflow: 'auto',
      // }}
    >
      <div
        className={`grid grid-cols-6 gap-1 font-medium text-sm w-full sticky top-0 z-10 bg-secondary px-1 py-2  uppercase`}
      >
        <span className="px-1 ">Hora</span>
        <span className="px-1 ">Documento</span>
        <span className="px-1 ">Tipo</span>
        <span className="px-1 ">Forma Pgto</span>
        <span className="px-1 ">Histórico</span>
        <span className="px-1 ">Valor</span>
      </div>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item, index) => {
          const key = `${item.index} - ${data[index].id}`;

          return (
            <div
              // ref={virtualizer.measureElement}
              key={key}
              data-index={`${index} ${key}`}
              className={`grid grid-cols-6 w-full gap-1 py-1 px-1 items-center bg-background text-xs ${
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
              <span className="px-1">
                {formatDate(data[index].data || "", "HH:mm:ss")}
              </span>
              <span className="px-1">{data[index].documento}</span>
              <span className="px-1">{data[index].tipo_operacao}</span>
              <span className="px-1">{data[index].forma_pagamento}</span>
              <span className="px-1">{data[index].historico}</span>
              <span className="px-1">
                {normalizeCurrency(data[index].valor)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RowVirtualizedFixedMovimentoCaixa;
