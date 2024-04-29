import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { useStoreTableCadastro } from "./store-table";
import { Search } from "lucide-react";

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
    <div className="flex gap-3 justify-end">
      <Input
      className="max-w-72"
        ref={searchRef}
        type="search"
        placeholder="Buscar..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(searchRef.current?.value || "");
          }
        }}
      />
      <Button variant={'tertiary'} onClick={() => handleSearch(searchRef.current?.value || "")}>
        <Search size={18} className="me-2"/> Procurar
      </Button>
    </div>
  );
};

export default FilterCadastros;
