import { Button } from "@/components/ui/button";
import { DollarSign, Pen, Trash } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { TituloSchemaProps } from "../../../form-data";

import { BtnNovoVencimento } from "./NovoVencimento";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import { normalizeCurrency } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { useMemo } from "react";
import { VencimentoTitulo } from "../../../store";
import { ModalGerarVencimentos } from "./GerarVencimentos";
import { ModalVencimento } from "./ModalVencimento";
import RemoverVencimentos from "./RemoverVencimentos";
import { useStoreVencimento } from "./context";

type SecaoVencimentosProps = {
  id?: string | null;
  form: UseFormReturn<TituloSchemaProps>;
  canEdit: boolean;
  disabled: boolean;
  modalEditing: boolean;
  readOnly: boolean;
};

const SecaoVencimentos = ({
  form,
  canEdit,
  modalEditing,
}: SecaoVencimentosProps) => {
  const { remove: removeVencimento } = useFieldArray({
    control: form.control,
    name: "vencimentos",
  });

  const wvencimentos = form.watch("vencimentos");

  const { setValue } = form;
  // const { formState: { errors } } = form;

  function handleRemoveVencimento(index: number) {
    setValue("update_vencimentos", true);
    removeVencimento(index);
  }

  const updateVencimento = useStoreVencimento().updateVencimento;
  const canEditVencimentos = canEdit && modalEditing;

  const columns = useMemo<ColumnDef<VencimentoTitulo>[]>(
    () => [
      {
        accessorKey: "id",
        header: "AÇÃO",
        cell: (info) => {
          const index = info.row.index;
          return (
            <div className="w-full flex items-center justify-center gap-2">
              {canEditVencimentos && (
                <>
                  <Button
                    onClick={() => {
                      // @ts-ignore
                      updateVencimento({
                        index,
                        vencimento: wvencimentos[index],
                      });
                    }}
                    type="button"
                    variant="warning"
                    size={"xs"}
                  >
                    <Pen size={18} />
                  </Button>

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
                </>
              )}
            </div>
          );
        },
        size: 80,
      },
      {
        accessorKey: "data_vencimento",
        header: "VENCIMENTO",
        cell: (info) => {
          let value = formatDate(info.getValue<Date>(), "dd/MM/yyyy");
          return <div className="w-full text-center">{value}</div>;
        },
        size: 80,
      },
      {
        accessorKey: "data_prevista",
        header: "PREVISÃO",
        size: 80,
        cell: (info) => {
          let value = formatDate(info.getValue<Date>(), "dd/MM/yyyy");
          return <div className="w-full text-center">{value}</div>;
        },
      },
      {
        accessorKey: "valor",
        header: "VALOR",
        size: 120,
        cell: (info) => {
          let valor = parseFloat(info.getValue<string>());
          let currency = normalizeCurrency(valor);
          return <div className={`w-full  px-2 text-end`}>{currency}</div>;
        },
      },
      {
        accessorKey: "linha_digitavel",
        header: "LINHA DIGITÁVEL",
        size: 400,
      },
    ],
    [wvencimentos, canEditVencimentos]
  );

  const valor_total = wvencimentos?.reduce((acc, curr) => {
    return acc + parseFloat(curr.valor);
  }, 0);

  return (
    <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
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
      <div className="flex gap-3">
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

export default SecaoVencimentos;
