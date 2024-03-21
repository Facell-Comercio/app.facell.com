import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

const FilterFornecedores = () => {
  const [search, setSearch] = useState<string>("")
 
  const { refetch: fetchFornecedores } = useQuery({
    queryKey: ['fornecedores'],
    queryFn: async () => await api.get('financeiro/fornecedores/', { params: { filters: { termo: search } } }),
    // enabled: open,
})

  async function handleSearch(text: string) {
    await new Promise((resolve) => {
        setSearch(text)
        resolve(true)
    })
    fetchFornecedores()
}

  const searchRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="flex gap-3">
      <Input type='search' placeholder="Buscar..." ref={searchRef} />
      <Button onClick={() => handleSearch(searchRef.current?.value || "")}>Procurar</Button>
    </div>
  );
};

export default FilterFornecedores;
