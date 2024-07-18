import { useQuery } from "@tanstack/react-query";
import Chart from "./components/Chart";
import Filters from "./components/Filters";
import Transacoes from "./components/Transacoes";
import { useExtratoStore } from "./components/context";
import { api } from "@/lib/axios";

const ExtratoTab = () => {
    const periodo = useExtratoStore().periodo;
    const contaBancaria = useExtratoStore().contaBancaria;

    const {data, isLoading, isFetching, isError, refetch} = useQuery({
        enabled: (!!periodo && !!contaBancaria),
        staleTime:0,
        queryKey: ["financeiro", "extrato_bancario", "transacao", "lista", {periodo, contaBancaria}],
        queryFn: () => api.get('financeiro/conciliacao-bancaria/extratos-bancarios/', {
            params: {
                filters: {
                    id_conta_bancaria: contaBancaria?.id,
                    periodo: periodo
                }
            }
        })
    })
    const rows = data?.data?.rows;
    const chartData = data?.data?.chartData;

    return (<div>
        <div className="mb-3 overflow-auto pb-3">
            <Filters refetch={refetch} isFetching={isFetching} />
        </div>
        <div className="mb-3">
            <Chart data={chartData} isLoading={isLoading}/>
        </div>
        <div className="mb-3">
            <Transacoes data={rows} isLoading={isLoading} isError={isError}/>
        </div>
    </div>);
}

export default ExtratoTab;