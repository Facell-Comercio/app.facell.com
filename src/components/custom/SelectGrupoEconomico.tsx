import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // Assuming these are custom components

type TSelectGrupoEconomico = {
  value: string | undefined;
  onChange: (id_grupo_economico?: string) => void;
  showAll?: boolean;
  className?: string;
  getIdMatriz?: boolean;
};

type GrupoEconomico = {
  id: number;
  nome: string;
  id_matriz: number;
  ativo: boolean;
};

const SelectGrupoEconomico = ({
  value,
  onChange,
  showAll,
  className,
  getIdMatriz,
}: TSelectGrupoEconomico) => {
  const { data } = useGrupoEconomico().getAll();
  const gruposEconomicos = data?.data?.rows || [];
  let valueName = "";
  if (getIdMatriz && value) {
    try {
      const parsedValue = JSON.parse(value);
      if (parsedValue) {
        valueName = parsedValue.id_grupo_economico;
      }
    } catch (error) {
      console.error("Erro ao analisar JSON:", error);
    }
  }

  return (
    <Select value={getIdMatriz ? valueName : value} onValueChange={onChange}>
      {/* Estilização sendo usada no cadastro de orçamentos */}
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder="Selecione o grupo" />
      </SelectTrigger>
      <SelectContent>
        {showAll && <SelectItem value="all">TODOS</SelectItem>}
        {gruposEconomicos?.map((item: GrupoEconomico) => {
          return getIdMatriz ? (
            <SelectItem
              className="text-left"
              key={item.id}
              value={JSON.stringify({
                id_grupo_economico: item.id.toString(),
                id_matriz: item.id_matriz.toString(),
              })}
            >
              {item.nome}
            </SelectItem>
          ) : (
            <SelectItem
              className="text-left"
              key={item.id}
              value={item.id.toString()}
            >
              {item.nome}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default SelectGrupoEconomico;
