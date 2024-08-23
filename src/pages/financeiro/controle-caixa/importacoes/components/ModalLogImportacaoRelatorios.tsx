import {
    ModalComponent,
    ModalComponentRow,
} from "@/components/custom/ModalComponent";
import { Spinner } from "@/components/custom/Spinner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MultiSelect } from "@/components/ui/multi-select";
import { normalizeFirstAndLastName } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { useState } from "react";

type LogImportacaoRelatorio = {
    id: number,
    usuario: string,
    relatorio: string,
    imported_at: Date,
    descricao: string,
}
type ModalLogImportacaoRelatoriosProps = {
    open: boolean,
    onOpenChange: (value: boolean) => boolean,
    relatorios: string[],
}

type PaginationProps = {
    pageSize: number;
    pageIndex: number;
};

const ModalLogImportacaoRelatorios = ({
    open,
    onOpenChange,
    relatorios,
}: ModalLogImportacaoRelatoriosProps) => {
    const [pagination, setPagination] = useState<PaginationProps>({
        pageSize: 15,
        pageIndex: 0,
    });
    const [relatoriosList, setRelatoriosList] = useState<string[] | []>([])
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['root', 'log_import_relatorio', 'lista', { pagination, relatoriosList }],
        refetchOnMount: true,
        staleTime: 0,
        queryFn: async () => {
            const result = await api.get('/financeiro/controle-de-caixa/importacoes/', { params: { pagination, filters: { relatorios: relatoriosList } } })
            return result.data;
        }
    });

    const pageCount = (data && data.pageCount) || 0;
    if (isError) return null;
    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Histórico de importação</DialogTitle>

                    <div className="flex gap-3">
                        <MultiSelect
                            options={relatorios.map(relatorio=> ({
                                value: relatorio,
                                label: relatorio,
                            }))}
                            onValueChange={setRelatoriosList}
                            defaultValue={relatorios || []}
                            placeholder="Relatórios"
                            variant="inverted"
                            animation={4}
                            maxCount={3}
                        />
                        <Button onClick={()=>refetch()}>{isLoading ? <span className="flex gap-2"><Spinner/>Atualizando...</span> : <span>Atualizar</span>}</Button>
                    </div>
                </DialogHeader>
                <ModalComponent
                    isLoading={isLoading}
                    pageCount={pageCount}
                    refetch={refetch}
                    pagination={pagination}
                    setPagination={setPagination}
                >
                    {data?.rows.map((item: LogImportacaoRelatorio) => (
                        <ModalComponentRow key={`logImportRelatorio.${item.id}`}>
                            <>
                                <span className="w-[40ch]">{formatDate(item.imported_at, 'dd/MM/yyyy HH:mm:ss')}</span>
                                <span className="w-[60ch]">{item.relatorio}</span>
                                <span className="w-[60ch]">{item.descricao}</span>
                                <span className="w-[60ch]">POR: {normalizeFirstAndLastName(item.usuario || 'SISTEMA')}</span>
                            </>
                        </ModalComponentRow>
                    ))}
                </ModalComponent>
            </DialogContent>
        </Dialog>
    );
};

export default ModalLogImportacaoRelatorios;
