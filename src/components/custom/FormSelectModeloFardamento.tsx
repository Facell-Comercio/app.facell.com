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
import { useModeloFardamento } from "@/hooks/useModeloFardamento";

interface IFormSelectModeloFardamento {
  name: string;
  type?: string;
  control: Control<any>;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
}

type Modelo = {
  id: number;
  modelo: string;
};

const FormSelectModeloFardamento = ({
  name,
  type,
  control,
  label,
  description,
  className,
  defaultValue,
  disabled,
}: IFormSelectModeloFardamento) => {
  const { data, isError, isLoading } = useModeloFardamento().getAll();
  const ModelosFardamento = data?.data?.rows;

  if (isLoading) return <div>Carregando modelos de fardamento...</div>; // Provide loading UI

  if (isError) return <div>Erro ao carregar modelos de fardamento</div>; // Handle errors

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
              {ModelosFardamento?.map((item: Modelo) => (
                <SelectItem
                  className="text-left"
                  key={item.id}
                  value={item.id.toString()}
                >
                  {item.modelo}
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

export default FormSelectModeloFardamento;
