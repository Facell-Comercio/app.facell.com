import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

type TSelectIsActive = {
  value?: string;
  onChange: (boolean?: string) => void;
  showAll?: boolean;
};

const SelectIsActive = ({ value, onChange }: TSelectIsActive) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">Inativo</SelectItem>
        <SelectItem value="1">Ativo</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectIsActive;
