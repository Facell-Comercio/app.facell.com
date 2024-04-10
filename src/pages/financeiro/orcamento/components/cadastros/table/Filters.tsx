import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { useStoreTableCadastro } from "./store-table";

const FilterCadastros = ({ refetch }: { refetch: () => void }) => {
  const { setFilters } = useStoreTableCadastro((state) => ({
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
      <Input
        ref={searchRef}
        type="search"
        placeholder="Buscar..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(searchRef.current?.value || "");
          }
        }}
      />
      <Button onClick={() => handleSearch(searchRef.current?.value || "")}>
        Procurar
      </Button>
    </div>
  );
};

export default FilterCadastros;
