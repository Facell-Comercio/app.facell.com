import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

type FiltersProps = {
  recebimentosConciliar: string;
  recebimentosConciliado: string;
  transacaoConciliar: string;
  transacaoConciliada: string;
  conciliacao: string;
};

export const SearchComponent = ({
  searchFilters,
  setSearchFilters,
  name,
}: {
  searchFilters: FiltersProps;
  setSearchFilters: (obj: FiltersProps) => void;
  name: string;
}) => {
  const searchRef = useRef<HTMLInputElement | null>(null);
  function onSearch() {
    if (name === "recebimentosConciliar") {
      setSearchFilters({
        ...searchFilters,
        recebimentosConciliar: searchRef.current?.value.toUpperCase() || "",
      });
    } else if (name === "recebimentosConciliado") {
      setSearchFilters({
        ...searchFilters,
        recebimentosConciliado: searchRef.current?.value.toUpperCase() || "",
      });
    } else if (name === "transacaoConciliar") {
      setSearchFilters({
        ...searchFilters,
        transacaoConciliar: searchRef.current?.value.toUpperCase() || "",
      });
    } else if (name === "transacaoConciliada") {
      setSearchFilters({
        ...searchFilters,
        transacaoConciliada: searchRef.current?.value.toUpperCase() || "",
      });
    } else if (name === "conciliacao") {
      setSearchFilters({
        ...searchFilters,
        conciliacao: searchRef.current?.value.toUpperCase() || "",
      });
    }
  }

  return (
    <div className="flex m-0 mt-0 gap-2 min-w-[20ch] max-w-[50ch]">
      <Input
        className="h-6 m-0 text-xs border-0"
        ref={searchRef}
        type="search"
        placeholder="Buscar..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />
      <Button size={"xs"} className="mt-0" onClick={() => onSearch()}>
        Procurar
      </Button>
    </div>
  );
};
