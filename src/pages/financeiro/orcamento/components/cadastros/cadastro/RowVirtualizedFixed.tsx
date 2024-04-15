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
}
interface RowVirtualizerFixedProps {
  data: itemContaProps[];
  form: any;
  removeItem: (index: number, id?: string) => void;
  modalEditing: boolean;
}

// const RowVirtualizerFixed: React.FC<RowVirtualizerFixedProps> = ({
//   data,
//   form,
//   removeItem,
//   modalEditing,
// }) => {
//   const parentRef = React.useRef(null);

//   const rowVirtualizer = useVirtualizer({
//     count: data.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 35,
//     overscan: 5,
//   });

//   return (
//     <>
//       <ScrollArea ref={parentRef} className="max-h-32">
//         <div
//           style={{
//             height: `${rowVirtualizer.getTotalSize() + 10}px`,
//             width: "100%",
//             position: "relative",
//           }}
//         >
//           {rowVirtualizer.getVirtualItems().map((virtualRow) => (
//             <div
//               key={virtualRow.index}
//               className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 width: "100%",
//                 height: `${virtualRow.size}px`,
//                 transform: `translateY(${virtualRow.start}px)`,
//               }}
//             >
//               {data.map((item, index) => {
//                 return (
//                   <div className="flex gap-2 py-1 pl-1" key={item.id}>
//                     <Input
//                       className="flex-1"
//                       value={item.centro_custo}
//                       readOnly={true}
//                     />
//                     <Input
//                       className="w-5/12"
//                       value={item.plano_contas}
//                       readOnly={true}
//                     />
//                     <FormInput
//                       type="number"
//                       className="flex-1"
//                       name={`contas.${index}.valor`}
//                       control={form.control}
//                       readOnly={!modalEditing}
//                     />
//                     <AlertPopUp
//                       title="Deseja realmente excluir?"
//                       description="Essa ação não pode ser desfeita. A conta será excluída definitivamente do servidor, podendo ser enviada novamente."
//                       action={() => removeItem(index, item.id_conta)}
//                     >
//                       {modalEditing ? (
//                         <Button
//                           type="button"
//                           className="w-1/12"
//                           variant={"destructive"}
//                         >
//                           <Trash />
//                         </Button>
//                       ) : (
//                         <></>
//                       )}
//                     </AlertPopUp>
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       </ScrollArea>
//     </>
//   );
// };

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
        {virtualizer.getVirtualItems().map((item, index) => (
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
            />
            <AlertPopUp
              title="Deseja realmente excluir?"
              description="Essa ação não pode ser desfeita. A conta será excluída definitivamente do servidor, podendo ser enviada novamente."
              action={() => removeItem(index, data[item.index].id_conta)}
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
        ))}
      </div>
    </div>
  );
};

export default RowVirtualizerFixed;
