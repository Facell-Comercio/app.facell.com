import * as React from "react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { generateStatusColor } from "@/helpers/generateColorStatus";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { VencimentosProps } from "@/pages/financeiro/components/ModalVencimentos";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Minus } from "lucide-react";

interface RowVirtualizerFixedProps {
  data: VencimentosProps[];
  form: any;
  removeItem: (index: number, id?: string, id_status?: string) => void;
  modalEditing: boolean;
}

const RowVirtualizerFixed: React.FC<RowVirtualizerFixedProps> = ({
  data,
  form,
  removeItem,
  modalEditing,
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
      className="pe-2 h-[300px] w-full overflow-auto scroll-thin"
      // style={{
      //   height: `300px`,
      //   width: `100%`,
      //   overflow: 'auto',
      // }}
    >
      <div className="flex gap-1 font-medium text-sm w-full sticky top-0 z-10 bg-slate-200 dark:bg-blue-950 px-1">
        {modalEditing && (
          <Checkbox
            className="min-w-4 me-1"
            onCheckedChange={(e) => {
              data.forEach((_, index) => {
                // if (item.id_status == "3") {
                form.setValue(`vencimentos.${index}.checked`, !!e.valueOf());
                // }
              });
            }}
          />
        )}
        <p className="min-w-16 text-center bg-slate-200 dark:bg-blue-950">ID</p>
        <p className="min-w-[72px] text-center bg-slate-200 dark:bg-blue-950">
          ID Título
        </p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">
          Status
        </p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">
          Previsto
        </p>
        <p className="flex-1 min-w-32 bg-slate-200 dark:bg-blue-950">
          Fornecedor
        </p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">
          Nº Doc
        </p>
        <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">
          Valor
        </p>
        <p className="flex-1 min-w-32 bg-slate-200 dark:bg-blue-950">Filial</p>
        {modalEditing && (
          <p className="flex-1 max-w-[52px] bg-slate-200 dark:bg-blue-950">
            Ação
          </p>
        )}
      </div>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item, index) => {
          const disabled = data[item.index].id_status != "3" ? true : false;

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
              {modalEditing && (
                <Checkbox
                  disabled={disabled}
                  checked={form.watch(`vencimentos.${item.index}.checked`)}
                  onCheckedChange={(e) => {
                    form.setValue(
                      `vencimentos.${item.index}.checked`,
                      e.valueOf()
                    );
                  }}
                  className="me-1"
                />
              )}
              <Input
                className="w-16 h-8 text-xs p-2 text-center"
                value={data[item.index].id_vencimento || ""}
                readOnly={true}
              />
              <Input
                className="w-[72px] h-8 text-xs p-2 text-center"
                value={data[item.index].id_titulo || ""}
                readOnly={true}
              />
              <Input
                className={`${generateStatusColor({
                  status: data[item.index].status,
                  bg: false,
                  text: true,
                })} w-24 h-8 text-xs p-2 text-center`}
                value={data[item.index].status || ""}
                readOnly={true}
              />
              <Input
                className="w-24 h-8 text-xs p-2 text-center"
                value={
                  data[item.index].previsao &&
                  normalizeDate(data[item.index].previsao || "")
                }
                readOnly={true}
              />
              <Input
                className="min-w-32 flex-1 h-8 text-xs p-2"
                value={data[item.index].nome_fornecedor || ""}
                readOnly={true}
              />
              <Input
                className="w-24 h-8 text-xs p-2 text-center"
                value={data[item.index].num_doc || ""}
                readOnly={true}
              />
              <Input
                className="w-32 h-8 text-xs p-2 text-end"
                value={
                  data[item.index].valor_total &&
                  normalizeCurrency(data[item.index].valor_total)
                }
                readOnly={true}
              />
              <Input
                className="flex-1 min-w-32 h-8 text-xs p-2"
                value={data[item.index].filial || ""}
                readOnly={true}
              />
              {/* <Input
              className="flex-1 h-8 text-xs p-2"
              value={data[item.index].data_pg||""}
              readOnly={true}
            /> */}
              <AlertPopUp
                title="Deseja realmente remover?"
                description="O vencimento será removido definitivamente deste borderô, podendo ser incluido novamente."
                action={() =>
                  removeItem(
                    item.index,
                    data[item.index].id_vencimento,
                    data[item.index].id_status
                  )
                }
              >
                {modalEditing ? (
                  <Button
                    disabled={disabled}
                    type="button"
                    className="h-8 text-xs"
                    variant={"destructive"}
                  >
                    <Minus size={20} />
                  </Button>
                ) : (
                  <></>
                )}
              </AlertPopUp>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RowVirtualizerFixed;
