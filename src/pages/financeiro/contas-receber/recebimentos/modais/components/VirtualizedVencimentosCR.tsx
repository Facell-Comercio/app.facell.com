import * as React from "react";

import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { normalizeDate } from "@/helpers/mask";
import { VencimentoCRProps } from "@/pages/financeiro/components/ModalVencimentosCR";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Equal } from "lucide-react";
import { FilterRecebimentosBancariosProps } from "../ModalRecebimentoBancario";

interface VirtualizerVencimentosProps {
  data: VencimentoCRProps[];
  setData: React.Dispatch<React.SetStateAction<VencimentoCRProps[]>>;
  filters: FilterRecebimentosBancariosProps;
}

const VirtualizedVencimentosCR: React.FC<VirtualizerVencimentosProps> = ({
  data,
  filters,
  setData,
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
      className="h-[45vh] w-full overflow-auto scroll-thin border rounded bg-background"
    >
      <div className="flex gap-1 font-medium text-xs w-full sticky top-0 z-20 bg-secondary">
        <p className="min-w-28 text-center bg-secondary">Data</p>
        <p className="min-w-24 text-center bg-secondary">ID Vencimento</p>
        <p className="min-w-36 pl-2 bg-secondary">Descrição</p>
        <p className="min-w-28 pl-2 bg-secondary">Em Aberto</p>
        <p className="min-w-[140px] pl-2 bg-secondary">Valor Pago</p>
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
              <Input className="text-xs w-36 h-8 p-2" value={data[item.index].descricao} readOnly />
              <Input
                className="text-xs w-28 h-8 p-2"
                value={data[item.index].valor || ""}
                readOnly
              />
              <Input
                className="text-xs w-28 h-8 p-2"
                value={data[item.index].valor_pagar}
                type="number"
                min={0}
                step={"0.01"}
                max={parseFloat(data[item.index].valor)}
                onChange={(e) =>
                  setData(
                    data.map((vencimento) => {
                      if (vencimento.id === data[item.index].id) {
                        return { ...vencimento, valor_pagar: e.target.value };
                      }
                      return vencimento;
                    })
                  )
                }
                disabled={!filters.id_extrato}
                title={!filters.id_extrato ? "Selecione a transação bancária" : ""}
              />
              <Button
                className="w-10 h-8 p-2"
                disabled={!filters.id_extrato}
                onClick={() =>
                  setData(
                    data.map((vencimento) => {
                      if (vencimento.id === data[item.index].id) {
                        return { ...vencimento, valor_pagar: data[item.index].valor };
                      }
                      return vencimento;
                    })
                  )
                }
                title={"Igualar valor pago ao valor em aberto"}
              >
                <Equal size={16} />
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VirtualizedVencimentosCR;
