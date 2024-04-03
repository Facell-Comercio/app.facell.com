import { Control, UseFormRegister } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Toption = {
  value: string,
  label: string,
}
interface IFormSelect { 
  name: string, 
  type?: string, 
  control: Control<any>, 
  register?: UseFormRegister<any>,
  label?: string, 
  description?: string, 
  readOnly?: boolean, 
  disabled?: boolean, 
  className?: string, 
  options: Toption[],
  showAll?: boolean,
  value?: string,
  placeholder?: string,
  onChange?: (value:string)=>void
}


const FormSelect = ({ name, type, options, control, label, description, className, showAll, disabled, placeholder }: IFormSelect) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex-1 ${type === "hidden" && "hidden"} `}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select disabled={disabled} value={field.value} defaultValue={field.value} onValueChange={field.onChange} >
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder || 'Selecione'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {showAll && <SelectItem key={'t'} value={'all'}>Todos(as)</SelectItem>}
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
