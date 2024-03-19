import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control } from 'react-hook-form'
import { Input } from "../ui/input";

interface IFormInput { 
  name: string, 
  type?: string, 
  control: Control<any>, 
  label?: string, 
  placeholder?: string, 
  description?: string, 
  readOnly?: boolean, 
  disabled?: boolean, 
  className?: string 
}

const FormInput = ({ name, type, control, label, placeholder, description, readOnly, disabled, className }: IFormInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input className={className} type={type || 'text'} readOnly={readOnly} disabled={disabled} placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
