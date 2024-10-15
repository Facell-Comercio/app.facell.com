import * as React from "react";

import { Input } from "@/components/custom/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { TransacoesConciliarProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cp/tables/TransacoesConciliar";
import { useVirtualizer } from "@tanstack/react-virtual";
import { FilterRecebimentosBancariosProps } from "../ModalRecebimentoBancario";

export interface TransacoesRecebimentoBancario extends TransacoesConciliarProps {
  valor_em_aberto?: string;
}

interface VirtualizerTransacoesProps {
  data: TransacoesRecebimentoBancario[];
  setFilters: React.Dispatch<React.SetStateAction<FilterRecebimentosBancariosProps>>;
  filters: FilterRecebimentosBancariosProps;
}

const VirtualizedTransacoesCR: React.FC<VirtualizerTransacoesProps> = ({
  data,
  setFilters,
  filters,
}) => {
  const parentElement = React.useRef(null);

  const count = data.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  const filtered = filters.id_extrato !== undefined;

  return (
    <section
      ref={parentElement}
      className="h-[45vh] w-full overflow-auto scroll-thin border bg-background rounded-md"
    >
      <div className="flex gap-1 font-medium text-xs px-1 w-full sticky top-0 z-20 bg-secondary">
        <p className="min-w-4 text-center bg-secondary"></p>
        <p className="min-w-16 text-center bg-secondary">ID</p>
        <p className="min-w-28 text-center bg-secondary">Data</p>
        <p className="min-w-28 pl-2 bg-secondary">Valor</p>
        <p className="min-w-28 pl-2 bg-secondary">Em Aberto</p>
        <p className="w-full min-w-64 pl-2 bg-secondary">Descrição</p>
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
              <Checkbox
                checked={data[item.index].id == filters.id_extrato}
                onCheckedChange={(value) => {
                  if (value) {
                    setFilters({
                      id_extrato: data[item.index].id,
                      data_transacao: data[item.index].data_transacao,
                    });
                  } else {
                    setFilters({
                      id_extrato: undefined,
                      data_transacao: undefined,
                    });
                  }
                }}
                // className="min-w-4 h-4"
                disabled={data[item.index].id != filters.id_extrato && filtered}
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
                className="text-xs w-28 h-8 p-2"
                value={
                  data[item.index].valor && normalizeCurrency(data[item.index].valor_em_aberto)
                }
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
