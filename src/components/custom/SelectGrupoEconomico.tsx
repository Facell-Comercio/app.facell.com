import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"; // Assuming these are custom components

type TSelectGrupoEconomico = {
  value: string | undefined,
  onChange: (id_grupo_economico?: string) => void,
  showAll?: boolean
}

type GrupoEconomico = {
  id: number,
  nome: string,
  id_matriz: number,
  ativo: boolean,
}

const SelectGrupoEconomico = ({ value, onChange }: TSelectGrupoEconomico) => {

  const { data } = useGrupoEconomico().getAll()
  const gruposEconomicos = data?.data?.rows || []

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione o grupo" />
      </SelectTrigger>
      <SelectContent>
        {/* {showAll && <SelectItem >Todos grupos</SelectItem>} */}
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
