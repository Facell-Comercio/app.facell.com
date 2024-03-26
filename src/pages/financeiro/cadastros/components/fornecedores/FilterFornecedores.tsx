import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { useStoreTableFornecedor } from "./table-fornecedores/store-table";

const FilterFornecedores = ({ refetch }: { refetch: () => void }) => {
 
  const {
    setFilters
  } = useStoreTableFornecedor(state => ({
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

export default FilterFornecedores;
