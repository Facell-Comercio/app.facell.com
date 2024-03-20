import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Toption = {
  value: string,
  label: string,
}
interface IFormSelect { 
  name: string, 
  control: Control<any>, 
  label?: string, 
  description?: string, 
  readOnly?: boolean, 
  disabled?: boolean, 
  className?: string, 
  options: Toption[],
  showAll?: boolean,
}


const FormSelect = ({ name, options, control, label, description, className, showAll }: IFormSelect) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select  onValueChange={field.onChange} defaultValue={field.value}>
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
