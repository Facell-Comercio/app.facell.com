import * as React from "react";

import { formatarDataHoraBr } from "@/helpers/format";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useVirtualizer } from "@tanstack/react-virtual";
import { LogsProps } from "./ModalLogs";

export interface itemContaProps {
  id?: string;
  plano_contas?: string;
  centro_custo?: string;
  id_conta?: string;
  saldo?: string;
  valor_inicial?: string;
}
interface RowVirtualizerLogsProps {
  data: LogsProps[];
}

const RowVirtualizerLogs: React.FC<RowVirtualizerLogsProps> = ({ data }) => {
  const parentElement = React.useRef(null);

  const count = data.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  return (
    <div ref={parentElement} className="pe-2 h-[500px] w-full overflow-auto">
      <div
        className="flex gap-2"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {virtualizer.getVirtualItems().map((item, index) => {
          let circleColor = "";
          if (data[item.index].descricao.charAt(0) === "E") {
            circleColor = "bg-red-700";
          } else if (data[item.index].descricao.charAt(0) === "T") {
            circleColor = "bg-purple-700";
          } else {
            circleColor = "bg-green-700";
          }
          return (
            <div className="flex flex-col pb-2" key={item.index}>
              <div
                // ref={virtualizer.measureElement}
                data-index={index}
                className={`grid grid-flow-col grid-cols-12 items-center justify-center py-2 pl-2 border-1 border-white text-xs  rounded-sm`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${item.size}px`,
                  transform: `translateY(${item.start}px)`,
                }}
              >
                <span className="flex items-center gap-3 col-span-2">
                  <span
                    className={`border-none rounded-full w-2 h-2 ${circleColor}`}
                  ></span>
                  <span className="col-span-1 text-center">
                    {formatarDataHoraBr(data[item.index].created_at)}
                  </span>
                </span>
                <span className="col-span-7 mx-2">
                  {data[item.index].descricao}
                </span>
                <span className="col-span-3">{data[item.index].nome}</span>
              </div>
              <Separator className="my-4 bg-gray-900" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RowVirtualizerLogs;
