import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";
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

interface IFormSelectGrupoEconomico {
  name: string;
  type?: string;
  control: Control<any>;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
}

type GrupoEconomico = {
  id: number;
  nome: string;
  id_matriz: number;
  ativo: boolean;
};

const FormSelectGrupoEconomico = ({
  name,
  type,
  control,
  label,
  description,
  className,
  defaultValue,
  disabled,
}: IFormSelectGrupoEconomico) => {
  const { data, isError, isLoading } = useGrupoEconomico().getAll();
  const gruposEconomicos = data?.data?.rows;

  if (isLoading) return <div>Carregando grupos econômicos...</div>; // Provide loading UI

  if (isError) return <div>Erro ao carregar grupos econômicos</div>; // Handle errors

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
              {gruposEconomicos?.map((item: GrupoEconomico) => (
                <SelectItem
                  className="text-left"
                  key={item.id}
                  value={item.id.toString()}
                >
                  {item.nome}
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

export default FormSelectGrupoEconomico;
