import * as React from "react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { normalizeCurrency } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Minus } from "lucide-react";
import { TitulosPropsConciliacao } from "./Modal";

interface RowVirtualizerFixedProps {
  data: TitulosPropsConciliacao[];
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
          return (
            <div
              // ref={virtualizer.measureElement}
              key={item.index}
              data-index={index}
              className={`flex gap-1 py-1 pl-1 items-center ${
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
                  checked={form.watch(`titulos.${item.index}.checked`)}
                  onCheckedChange={(e) => {
                    form.setValue(`titulos.${item.index}.checked`, e.valueOf());
                  }}
                  className="me-1"
                />
              )}
              <Input
                className="w-16 h-9 p-2 text-center"
                value={data[item.index].id_titulo || ""}
                readOnly={true}
              />
              <Input
                className="w-64 h-9 p-2"
                value={data[item.index].descricao || ""}
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
                  data[item.index].valor &&
                  normalizeCurrency(data[item.index].valor)
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
                  removeItem(item.index, data[item.index].id_titulo)
                }
              >
                {modalEditing ? (
                  <Button type="button" className="h-9" variant={"destructive"}>
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
    </div>
  );
};

export default RowVirtualizerFixed;
