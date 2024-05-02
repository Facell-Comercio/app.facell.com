import * as React from "react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { TitulosProps } from "@/pages/financeiro/components/ModalTitulos";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Minus, Trash } from "lucide-react";
import { generateStatusColor } from "@/helpers/generateColorStatus";

interface RowVirtualizerFixedProps {
  data: TitulosProps[];
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
    estimateSize: () => 44,
    overscan: 10,
  });

  return (
    <div
      ref={parentElement}
      className="pe-2 h-[300px] w-full overflow-auto"
    // style={{
    //   height: `300px`,
    //   width: `100%`,
    //   overflow: 'auto',
    // }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {virtualizer.getVirtualItems().map((item, index) => {
          const disabled = data[item.index].id_status != "3" ? true : false;

          return (
            <div
              // ref={virtualizer.measureElement}
              key={item.index}
              data-index={index}
              className={`flex gap-1 py-1 pl-1 items-center ${virtualizer.getVirtualItems().length == 0 && "hidden"
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
              {modalEditing &&
                <Checkbox
                  disabled={disabled}
                  checked={form.watch(`titulos.${item.index}.checked`)}
                  onCheckedChange={(e) => {
                    form.setValue(`titulos.${item.index}.checked`, e.valueOf());
                  }}
                  className="me-1"
                />
              }
              <Input
                className="w-16 h-9 p-2 text-center"
                value={data[item.index].id_titulo || ""}
                readOnly={true}
              />
              <Input
                className={`${generateStatusColor({ status: data[item.index].status, bg: false, text: true })} w-24 h-9 p-2 text-center`}
                value={
                  data[item.index].status || ""
                }
                readOnly={true}
              />
              <Input
                className="w-24 h-9 p-2 text-center"
                value={
                  data[item.index].previsao &&
                  normalizeDate(data[item.index].previsao || "")
                }
                readOnly={true}
              />
              <Input
                className="flex-1 h-9 p-2"
                value={data[item.index].nome_fornecedor || ""}
                readOnly={true}
              />
              <Input
                className="w-24 h-9 p-2 text-center"
                value={data[item.index].num_doc || ""}
                readOnly={true}
              />
              <Input
                className="w-32 h-9 p-2 text-end"
                value={
                  data[item.index].valor_total &&
                  normalizeCurrency(data[item.index].valor_total)
                }
                readOnly={true}
              />
              <Input
                className="flex-1 h-9 p-2"
                value={data[item.index].filial || ""}
                readOnly={true}
              />
              {/* <Input
              className="flex-1 h-9 p-2"
              value={data[item.index].data_pg||""}
              readOnly={true}
            /> */}
              <AlertPopUp
                title="Deseja realmente remover?"
                description="O título será removido definitivamente deste borderô, podendo ser incluido novamente."
                action={() =>
                  removeItem(
                    item.index,
                    data[item.index].id_titulo,
                    data[item.index].id_status
                  )
                }
              >
                {modalEditing ? (
                  <Button
                    disabled={disabled}
                    type="button"
                    className="h-9"
                    variant={"destructive"}
                  >
                    <Minus size={20} />
                  </Button>
                ) : (
                  <></>
                )}
              </AlertPopUp>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default RowVirtualizerFixed;
