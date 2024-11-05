import * as React from "react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormInput, { Input } from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import { InputDate } from "@/components/custom/InputDate";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { VencimentosProps } from "@/pages/financeiro/components/ModalFindItemsBordero";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Banknote, CreditCard, Landmark, Minus } from "lucide-react";
import { TbCurrencyReal } from "react-icons/tb";
import { useStoreCartao } from "../../cartoes/cartao/store";
import { RemoveItemVencimentosProps } from "./Form";

interface RowVirtualizerFixedErroProps {
  data: VencimentosProps[];
  filteredData: VencimentosProps[];
  form: any;
  removeItem: (item: RemoveItemVencimentosProps) => void;
  modalEditing: boolean;
}

const RowVirtualizerFixedErro: React.FC<RowVirtualizerFixedErroProps> = ({
  data,
  filteredData,
  form,
  removeItem,
  modalEditing,
}) => {
  const parentElement = React.useRef(null);

  const count = filteredData.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  const [openModalFatura] = useStoreCartao((state) => [state.openModalFatura]);

  type TipoBaixaProps = {
    id: number | string;
    label: string;
  };

  const tipoBaixa: TipoBaixaProps[] = [
    { id: "PADRÃO", label: "Total" },
    { id: "PARCIAL", label: "Parcial" },
    { id: "COM DESCONTO", label: "Com Desconto" },
    {
      id: "COM ACRÉSCIMO",
      label: "Com Acréscimo",
    },
  ];

  const allChecked = filteredData.length === filteredData.filter((item) => item.checked).length;
  const someChecked = filteredData.some((item) => item.checked);

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
            checked={allChecked || (someChecked && "indeterminate")}
            onCheckedChange={(e) => {
              filteredData.forEach((filteredVencimento) => {
                const indexData = data.findIndex(
                  (vencimento) =>
                    vencimento.id_item == filteredVencimento.id_item &&
                    vencimento.tipo == filteredVencimento.tipo
                );

                form.setValue(`itens.${indexData}.checked`, !!e.valueOf());
              });
            }}
          />
        )}
        <p className="min-w-[34px] text-center bg-slate-200 dark:bg-blue-950"></p>
        <p className="min-w-16 text-center bg-slate-200 dark:bg-blue-950">ID</p>
        <p className="min-w-[72px] text-center bg-slate-200 dark:bg-blue-950">ID Título</p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">Vencimento</p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">Previsto</p>
        <p className="flex-1 min-w-36 max-w-36 bg-slate-200 dark:bg-blue-950 text-center">
          Forma Pagamento
        </p>
        <p className="flex-1 min-w-44 bg-slate-200 dark:bg-blue-950">Fornecedor</p>
        <p className="flex-1 min-w-32 bg-slate-200 dark:bg-blue-950">Filial</p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">Nº Doc</p>

        <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">Valor</p>
        <p className="min-w-[132px] text-center bg-slate-200 dark:bg-blue-950">Valor Pago</p>
        <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">Tipo Baixa</p>
        {modalEditing && (
          <p className="min-w-44 text-center bg-slate-200 dark:bg-blue-950">
            Data Prevista Parcial
          </p>
        )}
        <p className="min-w-56 bg-slate-200 dark:bg-blue-950">Observação</p>
        <p className="flex-1 min-w-[88px] text-center bg-slate-200 dark:bg-blue-950">Em Remessa</p>
        {modalEditing && (
          <p className="flex-1 min-w-[52px] text-center bg-slate-200 dark:bg-blue-950">Ação</p>
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
          const indexData = data.findIndex(
            (vencimento) =>
              vencimento.id_vencimento === filteredData[item.index].id_vencimento &&
              vencimento.id_forma_pagamento === filteredData[item.index].id_forma_pagamento
          );

          const disabled = !data[indexData].can_remove ? true : false;
          const tipo = form.watch(`itens.${indexData}.tipo_baixa`);
          const valor = parseFloat(data[indexData].valor_total);
          const emRemessa = data[indexData].remessa;

          function IconeFormaPagamento() {
            if (data[indexData]?.id_forma_pagamento === 3) {
              return (
                <Button
                  className="py-1.5 max-h-8 text-xs text-center border-none bg-green-600 hover:bg-green-600/90 dark:bg-green-700 dark:hover:bg-green-700/90 cursor-default"
                  size={"xs"}
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
                  className="py-1.5 max-h-8 text-xs text-center border-none bg-zinc-600 hover:bg-zinc-600/90 dark:bg-zinc-700 dark:hover:bg-zinc-700/90"
                  size={"xs"}
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
              data-index={`${index} ${key}`}
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
                  checked={form.watch(`itens.${indexData}.checked`)}
                  onCheckedChange={(e) => {
                    form.setValue(`itens.${indexData}.checked`, e.valueOf());
                  }}
                  className="me-1"
                />
              )}
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
                className="flex-1 min-w-36 max-w-36 h-8 text-xs p-2 text-center"
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
              <FormInput
                type="number"
                inputClass="text-xs flex-1 min-w-24 h-8"
                readOnly={tipo == "PADRÃO" || !modalEditing}
                name={`itens.${indexData}.valor_pago`}
                control={form.control}
                min={tipo === "COM ACRÉSCIMO" ? valor : 0}
                max={tipo !== "COM ACRÉSCIMO" ? valor : valor * 1000}
                icon={TbCurrencyReal}
                iconLeft
                iconClass="h-8"
                disabled={!modalEditing || disabled || !tipo}
                onBlur={() => {
                  form.setValue(`itens.${indexData}.updated`, true);
                }}
              />
              <FormSelect
                name={`itens.${indexData}.tipo_baixa`}
                className="text-xs w-32 h-8"
                control={form.control}
                disabled={!modalEditing || disabled}
                options={tipoBaixa.map((tipo_baixa: TipoBaixaProps) => ({
                  value: tipo_baixa.id.toString(),
                  label: tipo_baixa.label,
                }))}
                onChange={() => {
                  form.setValue(`itens.${indexData}.valor_pago`, valor);
                  form.setValue(`itens.${indexData}.updated`, true);
                }}
              />
              {modalEditing && !disabled && tipo === "PARCIAL" ? (
                <InputDate
                  disabled={tipo !== "PARCIAL"}
                  className={`h-8 min-w-44 ${
                    form.formState.errors &&
                    form.formState.errors.vencimentos &&
                    form.formState.errors.vencimentos[indexData] &&
                    "border border-red-600"
                  }`}
                  value={form.watch(`itens.${indexData}.data_prevista_parcial`)}
                  onChange={(e: Date) =>
                    form.setValue(`itens.${indexData}.data_prevista_parcial`, e)
                  }
                />
              ) : (
                modalEditing && <Input className="h-8 min-w-44 text-center" value="-" disabled />
              )}
              <Input
                className="min-w-56 h-8 text-xs p-2 uppercase"
                value={data[indexData].obs || ""}
                readOnly
              />

              <AlertPopUp
                title="Deseja realmente prosseguir?"
                description={`O vencimento será marcado como ${
                  !!emRemessa ? "fora" : "dentro"
                } de uma remessa.`}
                action={() => {
                  form.setValue(`itens.${indexData}.remessa`, !emRemessa);
                  form.setValue(`itens.${indexData}.updated`, true);
                }}
                disabled={!modalEditing}
              >
                <Toggle
                  variant={"check"}
                  className={`h-8 ${
                    !!emRemessa &&
                    "bg-green-600 hover:bg-green-700 text-success-foreground hover:text-success-foreground"
                  }`}
                  disabled={!modalEditing}
                  pressed={!!emRemessa}
                >
                  <span className="text-xs min-w-16 uppercase">{!!emRemessa ? "SIM" : "NÃO"}</span>
                </Toggle>
              </AlertPopUp>
              <AlertPopUp
                title="Deseja realmente remover?"
                description="O vencimento será removido definitivamente deste borderô, podendo ser incluido novamente."
                action={() =>
                  removeItem({
                    index: indexData,
                    id: data[indexData].id_vencimento,
                    id_status: data[indexData].id_status,
                    tipo: data[indexData].tipo || "",
                  })
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

export default RowVirtualizerFixedErro;
