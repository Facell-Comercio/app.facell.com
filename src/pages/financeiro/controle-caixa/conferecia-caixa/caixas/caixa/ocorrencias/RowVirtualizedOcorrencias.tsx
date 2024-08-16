import * as React from "react";

import { normalizeDate, normalizeFirstAndLastName } from "@/helpers/mask";
import { OcorrenciasProps } from "@/hooks/financeiro/useConferenciasCaixa";
import { useVirtualizer } from "@tanstack/react-virtual";
import { FileSearch } from "lucide-react";
import { useStoreCaixa } from "../store";

interface RowVirtualizedFixedOcorrenciasProps {
  data: OcorrenciasProps[];
}

const RowVirtualizedFixedOcorrencias: React.FC<
  RowVirtualizedFixedOcorrenciasProps
> = ({ data }) => {
  const openModalOcorrencia = useStoreCaixa().openModalOcorrencia;
  const parentElement = React.useRef(null);

  const count = data.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  // const gridClass =
  //   "grid-cols-[minmax(20ch,_1fr)_minmax(20ch,_1fr)_minmax(20ch,_1fr)_minmax(20ch,_1fr)_minmax(20ch,_1fr)_minmax(20ch,_1fr)]";
  return (
    <div
      ref={parentElement}
      className="pe-1 max-h-[60vh] w-full rounded-md overflow-auto scroll-thin"
      // style={{
      //   height: `300px`,
      //   width: `100%`,
      //   overflow: 'auto',
      // }}
    >
      <div
        className={`flex gap-1 font-medium text-sm w-full sticky top-0 z-10 bg-secondary px-1 py-2  uppercase`}
      >
        <span className="px-1 w-8">ID</span>
        <span className="px-1 w-20">Data</span>
        <span className="px-1 w-24">Resolvida</span>
        <span className="px-1 flex-1">Descrição</span>
        <span className="px-1 flex-1 min-w-[20ch]">Usuário</span>
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
              className={`flex w-full gap-1 px-1 py-2 items-center bg-secondary/40 odd:bg-secondary/60 text-xs ${
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
              <span className="px-1 w-8 text-primary">
                <FileSearch
                  size={18}
                  className="cursor-pointer"
                  onClick={() => openModalOcorrencia(data[index].id || "")}
                />
              </span>
              <span className="px-1 w-20">
                {normalizeDate(data[index].data || "")}
              </span>
              <span
                className={`px-1 w-24 ${
                  data[index].resolvida ? "text-success" : "text-red-500"
                }`}
              >
                {data[index].resolvida ? "SIM" : "NÃO"}
              </span>
              <span className="px-1 flex-1 uppercase">
                {data[index].descricao}
              </span>
              <span className="px-1 flex-1 min-w-[20ch] uppercase">
                {normalizeFirstAndLastName(data[index].user_criador || "")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RowVirtualizedFixedOcorrencias;
