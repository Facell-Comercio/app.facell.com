import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

type TSelectTipo = {
  value?: string;
  onChange: (boolean?: string) => void;
  showAll?: boolean;
};

const SelectTipo = ({ value, onChange }: TSelectTipo) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Tipo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Receita">Receita</SelectItem>
        <SelectItem value="Despesa">Despesa</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectTipo;
