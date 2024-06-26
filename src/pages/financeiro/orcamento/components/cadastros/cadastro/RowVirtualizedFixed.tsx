import * as React from "react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Trash } from "lucide-react";

export interface itemContaProps {
  id?: string;
  plano_contas?: string;
  centro_custo?: string;
  id_conta?: string;
  saldo?: string;
  realizado?: string;
  valor?: string;
  valor_inicial?: string;
  active: boolean;
  active_inicial?: boolean;
  checked?: boolean;
}
interface RowVirtualizerFixedProps {
  id: string;
  data: itemContaProps[];
  form: any;
  removeItem: (index: number, id?: string) => void;
  modalEditing: boolean;
}

const RowVirtualizerFixed: React.FC<RowVirtualizerFixedProps> = ({
  id,
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
    estimateSize: () => 32,
    overscan: 10,
  });

  return (
    <div
      ref={parentElement}
      className={`pe-2 ${
        !!id ? "min-h-[290px]" : "min-h-[100px]"
      } max-h-[50vh] w-full overflow-auto scroll-thin`}
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
          if (data[item.index]?.realizado !== undefined) {
            minValue = Number(data[item.index].realizado);
          }
          //^ Infelizmente haverá muita re-renderização em cada onChange do Input
          //^ O FormInput não funcionou bem e nem consegui usar o useRef corretamente, os dados iniciais não eram salvos
          return (
            <div
              // ref={virtualizer.measureElement}
              key={`${item.index} `}
              data-index={index}
              className="flex items-center gap-1 py-1"
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
                className="h-6 w-6 me-1.5"
                checked={!!data[item.index].checked}
                onCheckedChange={(value) => {
                  form.setValue(`contas.${item.index}.checked`, !!value);
                }}
                disabled={!modalEditing}
              />
              <Input
                className="flex-1 h-7 text-xs"
                value={data[item.index].centro_custo}
                readOnly={true}
              />
              <Input
                className="flex-1 min-w-5/12 h-7 text-xs"
                value={data[item.index].plano_contas}
                readOnly={true}
              />
              <Input
                type="number"
                className="flex-1 h-7 text-xs"
                value={data[item.index].valor}
                onChange={(e) => {
                  form.setValue(`contas.${item.index}.valor`, e.target.value);
                }}
                readOnly={!modalEditing}
                min={minValue}
                step={"0.01"}
              />
              <Toggle
                variant={"check"}
                className={`h-7 me-1.5`}
                pressed={!!data[item.index].active}
                onPressedChange={(value) => {
                  form.setValue(`contas.${item.index}.active`, !!value);
                }}
                disabled={!modalEditing}
              >
                <span className="text-xs min-w-6 uppercase">
                  {!!data[item.index].active ? "ON" : "OFF"}
                </span>
              </Toggle>{" "}
              <AlertPopUp
                title="Deseja realmente excluir?"
                description="Essa ação não pode ser desfeita. A conta será excluída definitivamente do servidor, podendo ser enviada novamente."
                action={() => removeItem(item.index, data[item.index].id_conta)}
              >
                {modalEditing ? (
                  <Button
                    type="button"
                    size={"xs"}
                    className="w-16 h-7"
                    variant={"destructive"}
                  >
                    <Trash size={18} />
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
