import * as React from "react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { checkUserDepartments, hasPermission } from "@/helpers/checkAuthorization";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useBordero } from "@/hooks/financeiro/useBordero";
import { VencimentosProps } from "@/pages/financeiro/components/ModalFindItemsBordero";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Banknote, CreditCard, Landmark, Undo2 } from "lucide-react";
import { useStoreCartao } from "../../cartoes/cartao/store";
import { useStoreTituloPagar } from "../../titulos/titulo/store";
import { RemoveItemVencimentosProps } from "./Form";

interface RowVirtualizerFixedProgramadoProps {
  data: VencimentosProps[];
  filteredData: VencimentosProps[];
  form: any;
  removeItem: (item: RemoveItemVencimentosProps) => void;
  modalEditing: boolean;
}

const RowVirtualizerFixedProgramado: React.FC<RowVirtualizerFixedProgramadoProps> = ({
  data,
  filteredData,
  modalEditing,
}) => {
  const { mutate: reversePending } = useBordero().reversePending();
  const authorized = checkUserDepartments("FINANCEIRO") || hasPermission("MASTER");

  const parentElement = React.useRef(null);

  const count = filteredData.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  const [openModalFatura] = useStoreCartao((state) => [state.openModalFatura]);
  const [openModalTitulo] = useStoreTituloPagar((state) => [state.openModal]);

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
        <p className="min-w-[34px] text-center bg-slate-200 dark:bg-blue-950"></p>
        <p className="min-w-16 text-center bg-slate-200 dark:bg-blue-950">ID</p>
        <p className="min-w-[72px] text-center bg-slate-200 dark:bg-blue-950">ID Título</p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">Vencimento</p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">Previsto</p>
        <p className="flex-1 min-w-36 bg-slate-200 dark:bg-blue-950 text-center">Forma Pagamento</p>
        <p className="flex-1 min-w-44 bg-slate-200 dark:bg-blue-950">Fornecedor</p>
        <p className="flex-1 min-w-32 bg-slate-200 dark:bg-blue-950">Filial</p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">Nº Doc</p>

        <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">Valor</p>
        {modalEditing && authorized && (
          <>
            <p className="min-w-[52px] text-center bg-slate-200 dark:bg-blue-950">Ação</p>
          </>
        )}
        {/* <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">
          Valor Pago
        </p>
        <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">
          Tipo Baixa
        </p>
        <p className="min-w-56 text-center bg-slate-200 dark:bg-blue-950">
          Observação
        </p> */}
      </div>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          const indexData = data.findIndex(
            (vencimento) =>
              vencimento.id_vencimento === filteredData[item.index].id_vencimento &&
              vencimento.id_forma_pagamento === filteredData[item.index].id_forma_pagamento
          );

          function IconeFormaPagamento() {
            if (data[indexData]?.id_forma_pagamento === 3) {
              return (
                <Button
                  className="py-1.5 max-h-8 text-xs text-center border-none bg-green-600 hover:bg-green-600/90 dark:bg-green-700 dark:hover:bg-green-700/90 cursor-default"
                  size={"xs"}
                  onClick={() => openModalTitulo({ id: data[indexData].id_titulo || "" })}
                >
                  <Banknote size={18} />
                </Button>
              );
            } else if (data[indexData]?.id_forma_pagamento === 6) {
              return (
                <Button
                  className="py-1.5 max-h-8 text-xs text-center border-none bg-violet-600 hover:bg-violet-600/90 dark:bg-violet-700 dark:hover:bg-violet-600/90"
                  size={"xs"}
                  onClick={() => openModalFatura(data[indexData].id_vencimento || "")}
                >
                  <CreditCard size={18} />
                </Button>
              );
            } else {
              return (
                <Button
                  className="py-1.5 max-h-8 text-xs text-center border-none bg-zinc-600 hover:bg-zinc-600/90 dark:bg-zinc-700 dark:hover:bg-zinc-700/90 cursor-default"
                  size={"xs"}
                  onClick={() => openModalTitulo({ id: data[indexData].id_titulo || "" })}
                >
                  <Landmark size={18} />
                </Button>
              );
            }
          }
          const key = `${item.index} - ${data[indexData].id_item} - ${data[indexData].tipo}`;
          return (
            <div
              // ref={virtualizer.measureElement}
              key={key}
              data-index={key}
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
              <IconeFormaPagamento />
              <Input
                className="w-16 h-8 text-xs p-2 text-center"
                value={data[indexData].id_vencimento || ""}
                readOnly
              />
              <Input
                className="w-[72px] h-8 text-xs p-2 text-center"
                value={data[indexData].id_titulo || ""}
                readOnly
              />
              <Input
                className="w-24 h-8 text-xs p-2 text-center"
                // @ts-ignore
                value={
                  data[indexData].data_vencimento &&
                  normalizeDate(data[indexData].data_vencimento || "")
                }
                readOnly
              />
              <Input
                className="w-24 h-8 text-xs p-2 text-center"
                // @ts-ignore
                value={data[indexData].previsao && normalizeDate(data[indexData].previsao || "")}
                readOnly
              />
              <Input
                className="flex-1 w-36 h-8 text-xs p-2 text-center"
                value={data[indexData].forma_pagamento || ""}
                readOnly
              />
              <Input
                className="min-w-44 flex-1 h-8 text-xs p-2"
                value={data[indexData].nome_fornecedor || ""}
                readOnly
              />
              <Input
                className="flex-1 min-w-32 h-8 text-xs p-2"
                value={data[indexData].filial || ""}
                readOnly
              />
              <Input
                className="w-24 h-8 text-xs p-2 text-center"
                value={data[indexData].num_doc || ""}
                readOnly
              />
              <Input
                className="w-32 h-8 text-xs p-2 text-end"
                value={
                  data[indexData].valor_total && normalizeCurrency(data[indexData].valor_total)
                }
                readOnly
              />
              <AlertPopUp
                title="Deseja realmente retornar para pendente?"
                description="O vencimento retornará para o status pendente."
                action={() =>
                  reversePending({
                    id: data[indexData].id_vencimento,
                    tipo: data[indexData].tipo || "",
                  })
                }
              >
                {modalEditing && authorized ? (
                  <Button
                    disabled={!authorized}
                    type="button"
                    className="h-8 text-xs"
                    variant={"destructive"}
                    title="Retornar para pendente"
                  >
                    <Undo2 size={20} />
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

export default RowVirtualizerFixedProgramado;
