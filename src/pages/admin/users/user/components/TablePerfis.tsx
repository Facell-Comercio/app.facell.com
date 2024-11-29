import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
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

export const TableUserPerfis = ({ form, modalEditing }: TableProps) => {
  const { remove } = useFieldArray({
    name: "perfis",
    control: form.control,
  });
  const rows = form.watch("perfis");

  const columns: ColumnDef<UserFilial>[] = [
    {
      id: "acao",
      header: "AÇÃO",
      size: 100,
      cell: (info) => {
        let index = info.row.index;
        return (
          <AlertPopUp
            title="Deseja realmente remover o perfil do acesso?"
            description="Clique em salvar para persistir."
            action={() => {
              form.setValue("updatePerfis", true);
              remove(index);
            }}
          >
            <Button
              size={"xs"}
              variant={"destructive"}
              className="mx-auto"
              disabled={!modalEditing}
            >
              <Trash size={18} />
            </Button>
          </AlertPopUp>
        );
      },
    },
    {
      accessorKey: "perfil",
      header: "PERFIS",
      size: 300,
      cell: (info) => <div className="w-full text-center uppercase">{info.getValue<string>()}</div>,
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
