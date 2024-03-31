import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { useStoreGruposEconomicos } from "./store-table-grupos";

const Filters = ({ refetch }: { refetch: () => void }) => {
 
  const {
    setFilters
  } = useStoreGruposEconomicos(state => ({
    setFilters: state.setFilters
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
    <div className="flex gap-3 mb-3">
      <Input ref={searchRef} type="search" placeholder="Buscar..." />
      <Button onClick={() => handleSearch(searchRef.current?.value || "")}>Procurar</Button>
    </div>
  );
};

export default Filters;