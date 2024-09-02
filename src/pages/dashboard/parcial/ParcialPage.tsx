import { api } from "@/lib/axios";
import ParcialHeader from "./components/header";
import ParcialTable from "./components/table";
import ParcialCards from "./components/Cards";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/custom/Spinner";
import { useParcialStore } from "./components/context";
import { processarRowsTable } from "./components/helper";

const ParcialPage = () => {

    const range_data = useParcialStore((state) => state.range_data)

    const { data, refetch, isLoading, isError } = useQuery({
        queryKey: ["comercial", "dashboard", "parcial"],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const result = await api.get('/comercial/dashboard/parcial', { params: { range_data } })
            return result.data;
        }
    })

    const rowsTable = processarRowsTable(data)

    if (isError) {
        return <div>Ops! Erro ao buscar os dados!</div>
    }
    if (isLoading) {
        return <div><Spinner /> Carregando...</div>
    }

    return (
        <div className="flex flex-col gap-3  scroll-thin overflow-auto max-w-[100dvw]">
            <ParcialHeader refetch={refetch} />
            {/* Tabela */}
            <ParcialTable data={rowsTable} />

            {/* Cards */}
            {/* <ParcialCards data={data}/> */}
        </div>
    );
}

export default ParcialPage;