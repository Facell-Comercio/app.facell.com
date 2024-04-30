import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Mes = {
  id: string;
  mes: string;
};
type TSelectMes = {
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
};

const SelectMes = (props: TSelectMes) => {
  // Use a single state variable for fetching and storing data
  const arrayMes = [
    { id: "1", mes: "Janeiro" },
    { id: "2", mes: "Fevereiro" },
    { id: "3", mes: "Março" },
    { id: "4", mes: "Abril" },
    { id: "5", mes: "Maio" },
    { id: "6", mes: "Junho" },
    { id: "7", mes: "Julho" },
    { id: "8", mes: "Agosto" },
    { id: "9", mes: "Setembro" },
    { id: "10", mes: "Outubro" },
    { id: "11", mes: "Novembro" },
    { id: "12", mes: "Dezembro" },
  ];
  return (
    <Select onValueChange={props.onValueChange} value={props.value}>
      <SelectTrigger className={`min-w-[15ch] ${props.className}`}>
        <SelectValue
          placeholder={props.placeholder ? props.placeholder : `Selecione...`}
        />
      </SelectTrigger>
      <SelectContent>
        {arrayMes.map((option: Mes) => (
          <SelectItem key={option.id} value={option.id}>
            {option.mes}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectMes;
