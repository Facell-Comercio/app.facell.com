import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import FormSwitch from "@/components/custom/FormSwitch";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { UserFormData } from "../form-data";
import { UserCentroCusto } from "@/types/user-type";

type TableProps = {
    form: UseFormReturn<UserFormData>,
    modalEditing: boolean
}

export const TableUserCentrosCustos = ({ form, modalEditing }: TableProps) => {
    const {
        remove,
    } = useFieldArray({
        name: "centros_custo",
        control: form.control,
    });
    const rows = form.watch('centros_custo')

    const columns: ColumnDef<UserCentroCusto>[] = [
        {
            accessorKey: 'grupo_economico',
            header: 'GRUPO ECONÔMICO',
            size: 200,
        },
        {
            accessorKey: 'nome',
            header: 'CENTRO DE CUSTO',
            size: 300,
        },
        {
            accessorKey: 'gestor',
            header: 'GESTOR',
            cell: (info) => {
                let index = info.row.index
                return <FormSwitch
                    control={form.control}
                    name={`centros_custo.${index}.gestor`}
                    disabled={!modalEditing}
                    onChange={() => { form.setValue("updateCentrosCusto", true) }}
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
                    title="Deseja realmente remover o centro de custo do usuário?"
                    description="Clique em salvar para persistir."
                    action={() => {
                        form.setValue("updateCentrosCusto", true);
                        remove(index);
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
