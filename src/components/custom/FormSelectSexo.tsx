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

interface IFormSelectSexo {
  name: string;
  type?: string;
  control: Control<any>;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
}

const FormSelectSexo = ({
  name,
  type,
  control,
  label,
  description,
  className,
  defaultValue,
  disabled,
}: IFormSelectSexo) => {
  const sexos = ["F", "M"];

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
              {sexos?.map((sexo) => (
                <SelectItem className="text-left" key={sexo} value={sexo}>
                  {sexo}
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

export default FormSelectSexo;
