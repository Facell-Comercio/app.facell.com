import * as React from "react";

import { Input } from "@/components/custom/FormInput";
import { normalizeDate } from "@/helpers/mask";
import { VencimentoCRProps } from "@/pages/financeiro/components/ModalVencimentosCR";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualizerVencimentosProps {
  data: VencimentoCRProps[];
}

const VirtualizedVencimentosCR: React.FC<VirtualizerVencimentosProps> = ({ data }) => {
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
      className="h-[45vh] w-full overflow-auto scroll-thin z-[100] border rounded"
    >
      <div className="flex gap-1 font-medium text-xs w-full sticky top-0 z-[100] bg-secondary">
        <p className="min-w-28 text-center bg-secondary">Data</p>
        <p className="min-w-24 text-center bg-secondary">ID Vencimento</p>
        <p className="min-w-36 pl-2 bg-secondary">Descrição</p>
        <p className="min-w-28 pl-2 bg-secondary">Valor</p>
        <p className="min-w-28 pl-2 bg-secondary">Valor Pago</p>
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
              <Input
                className="text-xs w-28 h-8 p-2 text-center"
                // @ts-ignore
                value={data[item.index].data && normalizeDate(data[item.index].data)}
                readOnly
              />
              <Input
                className="text-xs w-24 h-8 p-2 text-center"
                value={data[item.index].id_vencimento || ""}
                readOnly
              />
              <Input
                className="text-xs min-w-36 h-8 p-2"
                value={data[item.index].descricao}
                readOnly
              />
              <Input
                className="text-xs w-28 h-8 p-2"
                value={data[item.index].valor || ""}
                readOnly
              />
              <Input className="text-xs w-28 h-8 p-2" value={"0"} type="number" min={0} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VirtualizedVencimentosCR;
