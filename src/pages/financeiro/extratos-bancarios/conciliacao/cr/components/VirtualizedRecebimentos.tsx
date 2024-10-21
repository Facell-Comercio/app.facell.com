import * as React from "react";

import { Input } from "@/components/custom/FormInput";
import { normalizeDate } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { RecebimentosConciliarProps } from "../tables/RecebimentosConciliar";

interface VirtualizerRecebimentosProps {
  data: RecebimentosConciliarProps[];
}

const VirtualizedRecebimentos: React.FC<VirtualizerRecebimentosProps> = ({ data }) => {
  const parentElement = React.useRef(null);

  const count = data.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  return (
    <section ref={parentElement} className="h-[45vh] w-full overflow-auto scroll-thin z-[100]">
      <div className="flex gap-1 font-medium text-xs w-full sticky top-0 z-[100] bg-background">
        <p className="min-w-24 text-center bg-background">ID Recebimento</p>
        <p className="min-w-20 text-center bg-background">ID Título</p>
        <p className="min-w-28 text-center bg-background">Transação</p>
        <p className="min-w-28 pl-2 bg-background">Valor Recebido</p>
        <p className="min-w-36 pl-2 bg-background">Descrição</p>
        <p className="min-w-36 pl-2 bg-background">Fornecedor</p>
        <p className="min-w-36 pl-2 bg-background">Filial</p>
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
              key={`${item.index}-${index}`}
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
                className="text-xs w-24 h-8 p-2 text-center"
                value={data[item.index].id_recebimento || ""}
                readOnly
              />
              <Input
                className="text-xs w-20 h-8 p-2 text-center"
                value={data[item.index].id_titulo || ""}
                readOnly
              />
              <Input
                className="text-xs w-28 h-8 p-2 text-center"
                // @ts-ignore
                value={
                  data[item.index].data_recebimento &&
                  normalizeDate(data[item.index].data_recebimento)
                }
                readOnly
              />
              <Input
                className="text-xs w-28 h-8 p-2"
                value={data[item.index].valor_recebido || ""}
                readOnly
              />

              <Input
                className="text-xs min-w-36 h-8 p-2"
                value={data[item.index].descricao}
                readOnly
              />
              <Input
                className="text-xs min-w-36 h-8 p-2"
                value={data[item.index].nome_fornecedor}
                readOnly
              />

              <Input
                className="text-xs min-w-36 h-8 p-2"
                value={data[item.index].filial}
                readOnly
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VirtualizedRecebimentos;
