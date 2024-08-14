import * as React from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

type MovimentoCaixaProps = {
  id?: string;
  hora?: string;
  doc?: string;
  tipo?: string;
  forma_pagamento?: string;
  historico?: string;
  valor?: string;
};

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
  console.log(virtualizer.getVirtualItems());

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
      <div className="grid grid-cols-6 gap-1 font-medium text-sm w-full sticky top-0 z-10 bg-slate-200 dark:bg-blue-950 px-1  uppercase">
        <span>Hora</span>
        <span>Documento</span>
        <span>Tipo</span>
        <span>Forma Pgto</span>
        <span>Histórico</span>
        <span>Valor</span>
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
              className={`grid grid-cols-6 w-full gap-1 py-1 px-1 items-center text-xs ${
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
              <span>1</span>
              <span>1</span>
              <span>1</span>
              <span>1</span>
              <span>1</span>
              <span>1</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RowVirtualizedFixedMovimentoCaixa;
