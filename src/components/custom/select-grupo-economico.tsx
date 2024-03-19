import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"; // Assuming these are custom components
import { useGrupoEconomico } from "@/hooks/use-grupo-economico";

type TSelectGrupoEconomico = {
   value: string | undefined, 
   onChange: ()=>void, 
   showAll?: boolean
}

type GrupoEconomico = {
  id: number,
  nome: string,
  id_matriz: number,
  ativo: boolean,
}

const SelectGrupoEconomico = ({ value, onChange, showAll = false }: TSelectGrupoEconomico) => {
  // Use a single state variable for fetching and storing data

  const { data, isError, isLoading } = useGrupoEconomico().getAll()
  const gruposEconomicos = data?.data
  console.log(gruposEconomicos)

  if (isLoading) return <div>Carregando grupos econômicos...</div>; // Provide loading UI

  if (isError) return <div>Erro ao carregar grupos econômicos</div>; // Handle errors

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Grupo econômico" />
      </SelectTrigger>
      <SelectContent>
        {showAll && <SelectItem value={''}>Todos grupos</SelectItem>}
        {gruposEconomicos?.map((item: GrupoEconomico) => (
          <SelectItem className="text-left" key={item.id} value={item.id.toString()}>
            {item.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectGrupoEconomico;
