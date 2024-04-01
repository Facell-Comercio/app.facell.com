import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { useStoreTableFornecedor } from "./store-table";

const FilterFornecedores = ({ refetch }: { refetch: () => void }) => {
  const { setFilters } = useStoreTableFornecedor((state) => ({
    setFilters: state.setFilters,
  }));

  async function handleSearch(text: string) {
    await new Promise((resolve) => {
      setFilters({ termo: text });
      resolve(true);
    });
    refetch();
  }

  const searchRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex gap-3">
      <Input ref={searchRef} type="search" placeholder="Buscar..." />
      <Button onClick={() => handleSearch(searchRef.current?.value || "")}>
        Procurar
      </Button>
    </div>
  );
};

export default FilterFornecedores;
