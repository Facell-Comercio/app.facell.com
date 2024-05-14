import * as React from "react";

import { Input } from "@/components/custom/FormInput";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TransacoesConciliadasProps } from "../tables/TransacoesConciliadas";

interface VirtualizerTransacoesProps {
  data: TransacoesConciliadasProps[];
  form: any;
}

const VirtualizedTransacoes: React.FC<VirtualizerTransacoesProps> = ({
  data,
  form,
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
        <p className="min-w-32 text-center">Doc</p>
        <p className="min-w-32 text-center">Valor</p>
        <p className="min-w-32 text-center">Transação</p>
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
                  className="text-xs min-w-64 h-8 p-2"
                  value={data[item.index].descricao}
                  readOnly={true}
                />
                <Input
                  className="text-xs min-w-32 h-8 p-2 text-center"
                  value={data[item.index].doc}
                  readOnly={true}
                />
                <Input
                  className="text-xs w-32 h-8 p-2 text-center"
                  value={
                    data[item.index].valor &&
                    normalizeCurrency(data[item.index].valor)
                  }
                  readOnly={true}
                />
                <Input
                  className="text-xs min-w-32 h-8 p-2 text-center"
                  value={
                    data[item.index].data_transacao &&
                    normalizeDate(data[item.index].data_transacao)
                  }
                  readOnly={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VirtualizedTransacoes;
