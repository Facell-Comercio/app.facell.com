import { Search } from "lucide-react";
import { useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "./FormInput";

interface TSearchComponent {
  handleSearch: (searchText: string) => void;
}

const SearchComponent = ({ handleSearch }: TSearchComponent) => {
  const searchRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex gap-3">
      <Input
        ref={searchRef}
        type="search"
        className="h-9"
        placeholder="Buscar..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(searchRef.current?.value || "");
          }
        }}
      />
      <Button
        type="button"
        variant={"tertiary"}
        size={"sm"}
        onClick={() => handleSearch(searchRef.current?.value || "")}
      >
        <Search size={18} className="me-2" /> Procurar
      </Button>
    </div>
  );
};

export default SearchComponent;
