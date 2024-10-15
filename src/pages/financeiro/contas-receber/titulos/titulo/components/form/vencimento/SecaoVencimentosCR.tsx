import { Button } from "@/components/ui/button";
import { DollarSign, Pen, Trash } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { BtnNovoVencimento } from "./NovoVencimento";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import { normalizeCurrency } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { useMemo } from "react";
import { TituloCRSchemaProps } from "../../../form-data";
import { VencimentoTituloCR } from "../../../store";
import { ModalGerarVencimentos } from "./GerarVencimentos";
import { ModalVencimento } from "./ModalVencimento";
import RemoverVencimentos from "./RemoverVencimentos";
import { useStoreVencimento } from "./context";

type SecaoVencimentosCRProps = {
  id?: string | null;
  form: UseFormReturn<TituloCRSchemaProps>;
  canEdit: boolean;
  disabled: boolean;
  modalEditing: boolean;
  readOnly: boolean;
};

const SecaoVencimentosCR = ({ form, canEdit, modalEditing }: SecaoVencimentosCRProps) => {
  const { remove: removeVencimento } = useFieldArray({
    control: form.control,
    name: "vencimentos",
  });

  const id_status = parseInt(form.watch("id_status") || "0");
  const emitido = id_status === 30;
  const pagoParcial = id_status === 40;
  const canEditRecebimento = pagoParcial || emitido;

  const wvencimentos = form.watch("vencimentos");

  const { setValue } = form;
  // const { formState: { errors } } = form;

  function handleRemoveVencimento(index: number) {
    setValue("update_vencimentos", true);
    removeVencimento(index);
  }

  const updateVencimento = useStoreVencimento().updateVencimento;
  const canEditVencimentos = (canEdit && modalEditing) || emitido;

  const columns = useMemo<ColumnDef<VencimentoTituloCR>[]>(
    () => [
      {
        accessorKey: "id",
        header: canEditVencimentos || canEditRecebimento ? "AÇÃO" : "",
        cell: (info) => {
          const index = info.row.index;
          return (
            <div className="w-full flex items-center justify-center gap-2">
              {(canEditVencimentos || canEditRecebimento) && (
                <>
                  <Button
                    onClick={() => {
                      updateVencimento({
                        index,
                        // @ts-ignore
                        vencimento: wvencimentos[index] || [],
                      });
                    }}
                    type="button"
                    variant="warning"
                    size={"xs"}
                  >
                    <Pen size={18} />
                  </Button>

                  {canEdit && (
                    <AlertPopUp
                      title="Deseja realmente remover o vencimento?"
                      description=""
                      action={() => handleRemoveVencimento(index)}
                      children={
                        <Button type="button" variant="destructive" size={"xs"}>
                          <Trash size={18} />
                        </Button>
                      }
                    />
                  )}
                </>
              )}
            </div>
          );
        },
        size: canEditVencimentos || canEditRecebimento ? 100 : 0,
      },
      {
        accessorKey: "data_vencimento",
        header: "VENCIMENTO",
        cell: (info) => {
          const value = formatDate(info.getValue<Date>(), "dd/MM/yyyy");
          return <div className="w-full text-center">{value}</div>;
        },
        size: 100,
      },
      {
        accessorKey: "valor",
        header: "VALOR",
        size: 120,
        cell: (info) => {
          const valor = parseFloat(info.getValue<string>());
          const currency = normalizeCurrency(valor);
          return <div className={`w-full  px-2 text-end`}>{currency}</div>;
        },
      },
      {
        accessorKey: "valor_pago",
        header: "VALOR PAGO",
        size: 120,
        cell: (info) => {
          const valor = parseFloat(info.getValue<string>());
          const currency = normalizeCurrency(valor);
          return <div className={`w-full  px-2 text-end`}>{currency}</div>;
        },
      },
      {
        accessorKey: "status",
        header: "STATUS",
        size: 120,
        cell: (info) => {
          const status = info.getValue<string>();
          return <div className={`w-full px-2 text-end capitalize`}>{status}</div>;
        },
      },
    ],
    [modalEditing, wvencimentos, canEditVencimentos]
  );

  const valor_total = wvencimentos?.reduce((acc, curr) => {
    return acc + parseFloat(curr.valor);
  }, 0);

  return (
    <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg max-w-full">
      <ModalVencimento form={form} />
      <div className="flex flex-col md:flex-row gap-3 mb-3 md:items-center">
        <span className="flex gap-2">
          <DollarSign />
          <span className="text-lg font-bold ">Vencimentos</span>
        </span>
        {canEdit && modalEditing && (
          <div className="md:ms-auto flex flex-wrap gap-3 md:items-center">
            <RemoverVencimentos form={form} />
            <ModalGerarVencimentos form={form} />
            <BtnNovoVencimento />
          </div>
        )}
      </div>
      <div className="flex w-full gap-3">
        <DataVirtualTableHeaderFixed
          data={wvencimentos}
          // @ts-ignore
          columns={columns}
        />
      </div>
      <div className="flex gap-3 mt-2 text-sm">
        <span>Total Vencimentos: </span>
        <span>{normalizeCurrency(valor_total || 0)}</span>
      </div>
    </div>
  );
};

export default SecaoVencimentosCR;
