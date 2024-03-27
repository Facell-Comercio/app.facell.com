import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Toption = {
  value: string,
  label: string,
}
interface IFormSelect { 
  name: string, 
  type?: string, 
  control?: Control<any>, 
  label?: string, 
  description?: string, 
  readOnly?: boolean, 
  disabled?: boolean, 
  className?: string, 
  options: Toption[],
  showAll?: boolean,
  defaultValue?: string,
}


const FormSelect = ({ name, type, options, control, label, description, className, showAll, defaultValue, disabled }: IFormSelect) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${type === "hidden" && "hidden"}`}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select disabled={disabled} onValueChange={field.onChange} defaultValue={defaultValue || field.value}>
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={'Selecione'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {showAll && <SelectItem key={'t'} value={'0'}>Todos(as)</SelectItem>}
              {options && options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
