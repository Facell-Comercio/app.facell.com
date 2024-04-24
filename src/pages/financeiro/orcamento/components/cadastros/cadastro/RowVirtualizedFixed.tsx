import * as React from "react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormInput, { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Trash } from "lucide-react";

export interface itemContaProps {
  id?: string;
  plano_contas?: string;
  centro_custo?: string;
  id_conta?: string;
  saldo?: string;
  valor_inicial?: string;
}
interface RowVirtualizerFixedProps {
  data: itemContaProps[];
  form: any;
  removeItem: (index: number, id?: string) => void;
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
          let minValue = 0;
          if (
            data[item.index]?.saldo !== undefined &&
            data[item.index]?.valor_inicial !== undefined
          ) {
            minValue =
              Number(data[item.index].valor_inicial) -
              Number(data[item.index].saldo);
          }

          return (
            <div
              // ref={virtualizer.measureElement}
              key={item.index}
              data-index={index}
              className="flex gap-2 py-1 pl-1"
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
                className="flex-1"
                value={data[item.index].centro_custo}
                readOnly={true}
              />
              <Input
                className="w-5/12"
                value={data[item.index].plano_contas}
                readOnly={true}
              />
              <FormInput
                type="number"
                className="flex-1"
                name={`contas.${item.index}.valor`}
                control={form.control}
                readOnly={!modalEditing}
                min={minValue}
              />
              <AlertPopUp
                title="Deseja realmente excluir?"
                description="Essa ação não pode ser desfeita. A conta será excluída definitivamente do servidor, podendo ser enviada novamente."
                action={() => removeItem(item.index, data[item.index].id_conta)}
              >
                {modalEditing ? (
                  <Button
                    type="button"
                    className="w-1/12"
                    variant={"destructive"}
                  >
                    <Trash />
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
