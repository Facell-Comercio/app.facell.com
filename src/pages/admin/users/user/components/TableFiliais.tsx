import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import FormSwitch from "@/components/custom/FormSwitch";
import { Button } from "@/components/ui/button";
import { UserFilial } from "@/types/user-type";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { UserFormData } from "../form-data";

type TableProps = {
  form: UseFormReturn<UserFormData>;
  modalEditing: boolean;
};

export const TableUserFiliais = ({ form, modalEditing }: TableProps) => {
  const { remove: removeFilial } = useFieldArray({
    name: "filiais",
    control: form.control,
  });
  const rows = form.watch("filiais");

  const columns: ColumnDef<UserFilial>[] = [
    {
      id: "acao",
      header: "AÇÃO",
      size: 100,
      cell: (info) => {
        let index = info.row.index;
        return (
          <AlertPopUp
            title="Deseja realmente remover a filial do usuário?"
            description="Clique em salvar para persistir."
            action={() => {
              form.setValue("updateFiliais", true);
              removeFilial(index);
            }}
          >
            <Button
              size={"xs"}
              className="mx-auto"
              variant={"destructive"}
              disabled={!modalEditing}
            >
              <Trash size={18} />
            </Button>
          </AlertPopUp>
        );
      },
    },
    {
      accessorKey: "grupo_economico",
      header: "GRUPO ECONÔMICO",
      size: 200,
    },
    {
      accessorKey: "nome",
      header: "FILIAL",
      size: 300,
    },
    {
      accessorKey: "gestor",
      header: "GESTOR",
      cell: (info) => {
        let index = info.row.index;
        return (
          <FormSwitch
            control={form.control}
            name={`filiais.${index}.gestor`}
            disabled={!modalEditing}
            onChange={() => {
              form.setValue("updateFiliais", true);
            }}
          />
        );
      },
      size: 100,
    },
  ];

  return (
    <DataVirtualTableHeaderFixed
      // @ts-ignore
      columns={columns}
      data={rows}
      className={`h-[300px] bg-background`}
    />
  );
};
