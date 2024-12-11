import * as React from "react";

import { Input } from "@/components/custom/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { normalizeCurrency } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useStoreTituloPagar } from "../../titulos/titulo/store";

type ItemFaturaProps = {
  id: string;
  id_titulo: string;
  valor: number;
  fornecedor: string;
  filial: string;
  num_doc: string;
};

interface RowVirtualizerFixedProps {
  data: ItemFaturaProps[];
  modalEditing: boolean;
  ids: string[];
  handleChangeIds: (id: string) => void;
}

const RowVirtualizerFixed: React.FC<RowVirtualizerFixedProps> = ({
  data,
  modalEditing,
  ids,
  handleChangeIds,
}) => {
  const parentElement = React.useRef(null);

  const count = data.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });
  const openModal = useStoreTituloPagar.getState().openModal;

  return (
    <section
      ref={parentElement}
      className="md:pe-2 h-[300px] w-full overflow-auto scroll-thin"
      // style={{
      //   height: `300px`,
      //   width: `100%`,
      //   overflow: 'auto',
      // }}
    >
      <div className="flex gap-1 font-medium text-sm w-full sticky top-0 z-10 bg-slate-200 dark:bg-blue-950 px-1">
        {modalEditing && (
          <Checkbox
            checked={
              count === ids.length || (ids.length > 0 && "indeterminate")
            }
            className="min-w-4 me-1"
            onCheckedChange={() => {
              data.forEach((item) => {
                handleChangeIds(item.id);
              });
            }}
          />
        )}
        <p className="min-w-16 text-center bg-slate-200 dark:bg-blue-950">ID</p>
        <p className="min-w-[72px] text-center bg-slate-200 dark:bg-blue-950">
          ID Título
        </p>
        <p className="flex-1 min-w-44 bg-slate-200 dark:bg-blue-950">
          Fornecedor
        </p>
        <p className="min-w-32 bg-slate-200 dark:bg-blue-950">Filial</p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">
          Nº Doc
        </p>

        <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">
          Valor
        </p>
      </div>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          const dataItem = data[item.index]; // Pegando o item correto no array data
          return (
            <div
              // ref={virtualizer.measureElement}
              key={`item-fatura:${item.index}`}
              data-index={item.index}
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
              {modalEditing && (
                <Checkbox
                  checked={ids.includes(dataItem.id)}
                  onCheckedChange={() => {
                    handleChangeIds(dataItem.id || "");
                  }}
                  className="me-1"
                />
              )}
              <Input
                className="w-16 h-8 text-xs p-2 text-center"
                value={dataItem.id || ""}
                readOnly
              />
              <Input
                className="w-[72px] h-8 text-xs p-2 text-center cursor-pointer"
                value={dataItem.id_titulo || ""}
                onClick={() => openModal({ id: dataItem.id_titulo })}
                readOnly
              />
              <Input
                className="flex-1 min-w-44 h-8 text-xs p-2"
                value={dataItem.fornecedor || ""}
                readOnly
              />
              <Input
                className="w-32 h-8 text-xs p-2"
                value={dataItem.filial || ""}
                readOnly
              />
              <Input
                className="w-24 h-8 text-xs p-2 text-center"
                value={dataItem.num_doc || ""}
                readOnly
              />
              <Input
                className="w-32 h-8 text-xs p-2 text-end"
                value={
                  dataItem.valor && normalizeCurrency(dataItem.valor)
                }
                readOnly
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RowVirtualizerFixed;
