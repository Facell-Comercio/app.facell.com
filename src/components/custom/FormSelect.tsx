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

type Toption = {
  value: string;
  label: string;
};
interface IFormSelect {
  name?: string;
  type?: string;
  control?: Control<any>;
  label?: string;
  description?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  options: Toption[];

  value?: string;
  showAll?: boolean;

  onChange?: (id?: string) => void;
}

const FormSelect = ({
  name,
  type,
  options,
  control,
  label,
  description,
  className,
  showAll,
  disabled,
  placeholder,

  value,
  onChange,
}: IFormSelect) => {
  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={`flex-1 ${type === "hidden" && "hidden"} `}>
            {label && <FormLabel>{label}</FormLabel>}
            <Select
              disabled={disabled}
              value={field.value}
              name={field.name}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger className={className}>
                  <SelectValue placeholder={"Selecione"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {showAll && (
                  <SelectItem key={"t"} value={"all"}>
                    Todos(as)
                  </SelectItem>
                )}
                {options &&
                  options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
  }
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && <SelectItem value="all">TODOS</SelectItem>}
        {options?.map((item: Toption) => (
          <SelectItem className="text-left" key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

};

export default FormSelect;
