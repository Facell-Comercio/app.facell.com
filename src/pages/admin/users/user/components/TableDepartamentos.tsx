import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import FormSwitch from "@/components/custom/FormSwitch";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { UserFormData } from "../form-data";
import { UserFilial } from "@/types/user-type";

type TableProps = {
  form: UseFormReturn<UserFormData>,
  modalEditing: boolean
}

export const TableUserDepartamentos = ({ form, modalEditing }: TableProps) => {
  const {
    remove: removeFilial,
  } = useFieldArray({
    name: "departamentos",
    control: form.control,
  });
  const rows = form.watch('departamentos')

  const columns: ColumnDef<UserFilial>[] = [
    {
      accessorKey: 'nome',
      header: 'FILIAL',
      size: 300,
    },
    {
      accessorKey: 'gestor',
      header: 'GESTOR',
      cell: (info) => {
        let index = info.row.index
        return <FormSwitch
          control={form.control}
          name={`departamentos.${index}.gestor`}
          disabled={!modalEditing}
          onChange={() => { form.setValue("updateDepartamentos", true) }}
        />
      },
      size: 100,
    },
    {
      id: 'acao',
      header: 'AÇÃO',
      size: 100,
      cell: (info) => {
        let index = info.row.index
        return <AlertPopUp
          title="Deseja realmente remover a filial do acesso?"
          description="Clique em salvar para persistir."
          action={() => {
            form.setValue("updateDepartamentos", true);
            removeFilial(index);
          }}
        >
          <Button
            size={"xs"}
            variant={"destructive"}
            disabled={!modalEditing}
          >
            <Trash size={18} />
          </Button>
        </AlertPopUp>

      }
    },

  ]

  return (
    <DataVirtualTableHeaderFixed
      // @ts-ignore
      columns={columns}
      data={rows}
      className={`h-[300px]`}
    />
  );
}
