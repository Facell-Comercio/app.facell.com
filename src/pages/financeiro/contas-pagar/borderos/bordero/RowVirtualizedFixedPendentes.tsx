import * as React from "react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormInput, { Input } from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import { InputDate } from "@/components/custom/InputDate";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { VencimentosProps } from "@/pages/financeiro/components/ModalVencimentos";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Minus } from "lucide-react";
import { TbCurrencyReal } from "react-icons/tb";

interface RowVirtualizerFixedPendentesProps {
  data: VencimentosProps[];
  filteredData: VencimentosProps[];
  form: any;
  removeItem: (index: number, id?: string, id_status?: string) => void;
  modalEditing: boolean;
}

const RowVirtualizerFixedPendentes: React.FC<
  RowVirtualizerFixedPendentesProps
> = ({ data, filteredData, form, removeItem, modalEditing }) => {
  const parentElement = React.useRef(null);

  const count = filteredData.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  type TipoBaixaProps = {
    id: number | string;
    label: string;
  };
  const tipoBaixa: TipoBaixaProps[] = [
    { id: "PADRÃO", label: "Total" },
    { id: "PARCIAL", label: "Parcial" },
    { id: "COM DESCONTO", label: "Com Desconto" },
    { id: "COM ACRÉSCIMO", label: "Com Acréscimo" },
  ];

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
              filteredData.forEach((_, index) => {
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
          Previsto
        </p>
        <p className="flex-1 min-w-36 max-w-36 bg-slate-200 dark:bg-blue-950 text-center">
          Forma Pagamento
        </p>
        <p className="flex-1 min-w-44 bg-slate-200 dark:bg-blue-950">
          Fornecedor
        </p>
        <p className="flex-1 min-w-32 bg-slate-200 dark:bg-blue-950">Filial</p>
        <p className="min-w-24 text-center bg-slate-200 dark:bg-blue-950">
          Nº Doc
        </p>

        <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">
          Valor
        </p>
        <p className="min-w-[132px] text-center bg-slate-200 dark:bg-blue-950">
          Valor Pago
        </p>
        <p className="min-w-32 text-center bg-slate-200 dark:bg-blue-950">
          Tipo Baixa
        </p>
        {modalEditing && (
          <>
            <p className="min-w-44 text-center bg-slate-200 dark:bg-blue-950">
              Data Prevista Parcial
            </p>
            <p className="flex-1 min-w-[52px] text-center bg-slate-200 dark:bg-blue-950">
              Ação
            </p>
          </>
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
              vencimento.id_vencimento ===
              filteredData[item.index].id_vencimento
          );

          const disabled = !data[indexData].can_remove ? true : false;
          const tipo = form.watch(`vencimentos.${indexData}.tipo_baixa`);
          const valor = parseFloat(data[indexData].valor_total);
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
                  checked={form.watch(`vencimentos.${indexData}.checked`)}
                  onCheckedChange={(e) => {
                    form.setValue(
                      `vencimentos.${indexData}.checked`,
                      e.valueOf()
                    );
                  }}
                  className="me-1"
                />
              )}
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
                value={
                  data[indexData].previsao &&
                  normalizeDate(data[indexData].previsao || "")
                }
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
                  data[indexData].valor_total &&
                  normalizeCurrency(data[indexData].valor_total)
                }
                readOnly
              />
              <FormInput
                type="number"
                inputClass="text-xs flex-1 min-w-24 h-8"
                readOnly={tipo == "PADRÃO" || !modalEditing}
                name={`vencimentos.${indexData}.valor_pago`}
                control={form.control}
                min={tipo === "COM ACRÉSCIMO" ? valor : 0}
                max={tipo !== "COM ACRÉSCIMO" ? valor : valor * 1000}
                icon={TbCurrencyReal}
                iconLeft
                iconClass="h-8"
                disabled={!modalEditing || disabled || !tipo}
                onBlur={() => {
                  form.setValue(`vencimentos.${indexData}.updated`, true);
                }}
              />
              <FormSelect
                name={`vencimentos.${indexData}.tipo_baixa`}
                className="text-xs w-32 h-8"
                control={form.control}
                disabled={!modalEditing || disabled}
                options={tipoBaixa.map((tipo_baixa: TipoBaixaProps) => ({
                  value: tipo_baixa.id.toString(),
                  label: tipo_baixa.label,
                }))}
                onChange={() => {
                  form.setValue(`vencimentos.${indexData}.valor_pago`, valor);
                  form.setValue(`vencimentos.${indexData}.updated`, true);
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
                  value={form.watch(
                    `vencimentos.${indexData}.data_prevista_parcial`
                  )}
                  onChange={(e: Date) =>
                    form.setValue(
                      `vencimentos.${indexData}.data_prevista_parcial`,
                      e
                    )
                  }
                />
              ) : (
                modalEditing && (
                  <Input
                    className="h-8 min-w-44 text-center"
                    value="-"
                    disabled
                  />
                )
              )}
              <AlertPopUp
                title="Deseja realmente remover?"
                description="O vencimento será removido definitivamente deste borderô, podendo ser incluido novamente."
                action={() =>
                  removeItem(
                    indexData,
                    data[indexData].id_vencimento,
                    data[indexData].id_status
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

export default RowVirtualizerFixedPendentes;
