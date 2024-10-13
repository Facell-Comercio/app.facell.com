import * as React from "react";

import { Input } from "@/components/custom/FormInput";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { TransacoesConciliarProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cp/tables/TransacoesConciliar";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualizerTransacoesProps {
  data: TransacoesConciliarProps[];
}

const VirtualizedTransacoesCR: React.FC<VirtualizerTransacoesProps> = ({ data }) => {
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
      className="h-[45vh] w-full overflow-auto scroll-thin z-50 border rounded-md"
    >
      <div className="flex gap-1 font-medium text-xs px-1 w-full sticky top-0 z-[100] bg-secondary">
        <p className="min-w-16 text-center bg-secondary">ID</p>
        <p className="min-w-28 text-center bg-secondary">Transação</p>
        <p className="min-w-28 pl-2 bg-secondary">Valor</p>
        <p className="flex-1 min-w-64 pl-2 bg-secondary">Descrição</p>
        {/* <p className="min-w-32 pl-2 bg-secondary">Conta Bancária</p> */}
        <p className="min-w-24 text-center bg-secondary">Doc</p>
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
              className={`flex w-full gap-1 py-1 px-1 items-center odd:bg-secondary/60 even:bg-secondary/40 text-xs ${
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
              <Checkbox
              // checked={
              //   table.getIsAllPageRowsSelected() ||
              //   (table.getIsSomePageRowsSelected() && "indeterminate")
              // }
              // onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              />
              <Input
                className="text-xs w-16 h-8 p-2 text-center"
                value={data[item.index].id_transacao || ""}
                readOnly={true}
              />
              <Input
                className="text-xs w-28 h-8 p-2 text-center"
                // @ts-ignore
                value={
                  data[item.index].data_transacao && normalizeDate(data[item.index].data_transacao)
                }
                readOnly={true}
              />
              <Input
                className="text-xs w-28 h-8 p-2"
                value={data[item.index].valor && normalizeCurrency(data[item.index].valor)}
                readOnly={true}
              />
              <Input
                className="flex-1 text-xs min-w-64 h-8 p-2"
                value={data[item.index].descricao}
                readOnly={true}
              />
              {/* <Input
                className="text-xs w-32 h-8 p-2"
                value={data[item.index].conta_bancaria}
                readOnly={true}
              /> */}
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

export default VirtualizedTransacoesCR;
