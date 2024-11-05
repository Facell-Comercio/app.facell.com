import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRef } from "react";
import { useStoreTablePlanos } from "./store-table";

const FilterPlanos = ({ refetch }: { refetch: () => void }) => {
  const { setFilters } = useStoreTablePlanos((state) => ({
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
      />{" "}
      <Button variant={"tertiary"} onClick={() => handleSearch(searchRef.current?.value || "")}>
        <Search size={18} className="me-2" /> Procurar
      </Button>
    </div>
  );
};

export default FilterPlanos;
