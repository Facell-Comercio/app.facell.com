import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import { Button } from "@/components/ui/button";
import { FilialUser } from "@/context/auth-store";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { UserFormData } from "../form-data";

type TableProps = { 
    form: UseFormReturn<UserFormData>, 
    modalEditing: boolean 
}

export const TableUserPermissoes = ({ form, modalEditing }: TableProps) => {
    const {
        remove,
    } = useFieldArray({
        name: "permissoes",
        control: form.control,
    });
    const rows = form.watch('permissoes')

    const columns: ColumnDef<FilialUser>[] = [
        {
            accessorKey: 'nome',
            header: 'PERMISSÃO',
            size: 300,
        },
        {
            id: 'acao',
            header: 'AÇÃO',
            size: 100,
            cell: (info) => {
                let index = info.row.index
                return <AlertPopUp
                title="Deseja realmente remover a Permissão do acesso?"
                description="Clique em salvar para persistir."
                action={() => {
                    form.setValue("updatePermissoes", true);
                    remove(index);
                }}
              >
                <Button
                  size={"xs"}
                  variant={"destructive"}
                  disabled={!modalEditing}
                >
                  <Trash size={18}/>
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
