import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTamanhoFardamento } from "@/hooks/useTamanhoFardamento";

interface IFormSelectTamanhoFardamento {
  name: string;
  type?: string;
  control: Control<any>;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
}

type Tamanho = {
  id: number;
  tamanho: string;
};

const FormSelectTamanhoFardamento = ({
  name,
  type,
  control,
  label,
  description,
  className,
  defaultValue,
  disabled,
}: IFormSelectTamanhoFardamento) => {
  const { data, isError, isLoading } = useTamanhoFardamento().getAll();
  const TamanhosFardamento = data?.data?.rows;

  if (isLoading) return <div>Carregando tamanhos de fardamento...</div>; // Provide loading UI

  if (isError) return <div>Erro ao carregar tamanhos de fardamento</div>; // Handle errors

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${type === "hidden" && "hidden"} flex-1`}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            defaultValue={defaultValue || field.value}
          >
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={"Selecione"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {TamanhosFardamento?.map((item: Tamanho) => (
                <SelectItem
                  className="text-left"
                  key={item.id}
                  value={item.id.toString()}
                >
                  {item.tamanho}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelectTamanhoFardamento;
