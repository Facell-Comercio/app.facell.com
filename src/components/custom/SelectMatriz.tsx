import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // Assuming these are custom components

type TSelectMatriz = {
  value: string | undefined;
  onChange: (id_grupo_economico?: string) => void;
  showAll?: boolean;
  className?: string;
  disabled?: boolean;
};

type Matriz = {
  id: number;
  nome: string;
};

const SelectMatriz = ({
  value,
  onChange,
  showAll,
  className,
  disabled,
}: TSelectMatriz) => {
  const { data } = useGrupoEconomico().getAllMatriz();
  const matriz = data?.data?.rows || [];

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      {/* Estilização sendo usada no cadastro de orçamentos */}
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder="Selecione a matriz" />
      </SelectTrigger>
      <SelectContent>
        {showAll && matriz && matriz.length > 1 && (
          <SelectItem value="all">TODOS</SelectItem>
        )}
        {matriz?.map((item: Matriz, index: number) => (
          <SelectItem
            className="text-left"
            key={`${item.id} - ${index}`}
            value={String(item.id)}
          >
            {item.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectMatriz;
