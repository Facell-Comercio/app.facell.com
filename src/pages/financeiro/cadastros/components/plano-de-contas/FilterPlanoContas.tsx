import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { useStoreTablePlanoContas } from "./table-plano-contas/store-table";

const FilterPlanoContas = ({ refetch }: { refetch: () => void }) => {
 
  const {
    setFilters
  } = useStoreTablePlanoContas(state => ({
    rowCount: state.rowCount,
    filters: state.filters,
    pagination: state.pagination,
    setPagination: state.setPagination,
    setFilters: state.setFilters,
    sorting: state.sorting,
    setSorting: state.setSorting,
    rowSelection: state.rowSelection,
    setRowSelection: state.setRowSelection,
    isAllSelected: state.isAllSelected
  }))

  async function handleSearch(text: string) {
    await new Promise((resolve) => {
      setFilters({termo: text})
        resolve(true)
      })
    refetch()
}

  const searchRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="flex gap-3">
      <Input ref={searchRef} type="search" placeholder="Buscar..." />
      <Button onClick={() => handleSearch(searchRef.current?.value || "")}>Procurar</Button>
    </div>
  );
};

export default FilterPlanoContas;
