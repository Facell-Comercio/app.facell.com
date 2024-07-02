import * as React from "react";

import { Input } from "@/components/custom/FormInput";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TransacoesConciliarProps } from "../tables/TransacoesConciliar";

interface VirtualizerTransacoesProps {
  data: TransacoesConciliarProps[];
}

const VirtualizedTransacoes: React.FC<VirtualizerTransacoesProps> = ({
  data,
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
      className="h-[45vh] w-full overflow-auto scroll-thin z-50"
    >
      <div className="flex gap-1 font-medium text-xs px-1 w-full sticky top-0 z-50 bg-background">
        <p className="min-w-16 text-center bg-background">ID</p>
        <p className="min-w-28 text-center bg-background">Transação</p>
        <p className="min-w-28 pl-2 bg-background">Valor</p>
        <p className="min-w-64 pl-2 bg-background">Descrição</p>
        <p className="min-w-24 text-center bg-background">Doc</p>
      </div>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item, index) => {
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
                value={data[item.index].id_transacao || ""}
                readOnly={true}
              />
              <Input
                className="text-xs w-28 h-8 p-2 text-center"
                value={
                  data[item.index].data_transacao &&
                  normalizeDate(data[item.index].data_transacao)
                }
                readOnly={true}
              />
              <Input
                className="text-xs w-28 h-8 p-2"
                value={
                  data[item.index].valor &&
                  normalizeCurrency(data[item.index].valor)
                }
                readOnly={true}
              />
              <Input
                className="text-xs min-w-64 h-8 p-2"
                value={data[item.index].descricao}
                readOnly={true}
              />
              <Input
                className="text-xs w-24 h-8 p-2 text-center"
                value={data[item.index].doc}
                readOnly={true}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VirtualizedTransacoes;
