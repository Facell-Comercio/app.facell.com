import * as React from "react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Trash } from "lucide-react";

export interface itemContaProps {
  checked?: boolean;
  id_titulo?: string;
  vencimento?: string;
  nome_fornecedor?: string;
  valor_total?: string;
  n_doc?: string;
  descricao?: string;
  filial?: string;
  data_pg?: string;
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
      className="pe-2 h-[250px] w-full overflow-auto"
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
        {virtualizer.getVirtualItems().map((item, index) => (
          <div
            // ref={virtualizer.measureElement}
            key={item.index}
            data-index={index}
            className="flex gap-1 py-1 pl-1 items-center"
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
              onCheckedChange={(e) => {
                form.setValue(`titulos.${item.index}.checked`, e.valueOf());
                console.log(e.valueOf());
              }}
            />
            <Input
              className="w-16 h-9 p-2"
              value={data[item.index].id_titulo}
              readOnly={true}
            />
            <Input
              className="flex-1 h-9 p-2"
              value={data[item.index].nome_fornecedor}
              readOnly={true}
            />
            <Input
              className="w-24 h-9 p-2"
              value={data[item.index].n_doc}
              readOnly={true}
            />
            <Input
              className="w-24 h-9 p-2"
              value={data[item.index].valor_total}
              readOnly={true}
            />
            <Input
              className="flex-1 h-9 p-2"
              value={data[item.index].filial}
              readOnly={true}
            />
            <Input
              className="w-24 h-9 p-2"
              value={data[item.index].vencimento}
              readOnly={true}
            />
            {/* <Input
              className="flex-1 h-9 p-2"
              value={data[item.index].data_pg}
              readOnly={true}
            /> */}
            <AlertPopUp
              title="Deseja realmente excluir?"
              description="Essa ação não pode ser desfeita. A conta será excluída definitivamente do servidor, podendo ser enviada novamente."
              action={() => removeItem(index, data[item.index].id_titulo)}
            >
              {modalEditing ? (
                <Button type="button" className="h-9" variant={"destructive"}>
                  <Trash size={20} />
                </Button>
              ) : (
                <></>
              )}
            </AlertPopUp>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RowVirtualizerFixed;
