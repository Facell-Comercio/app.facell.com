import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
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
        <FormItem className={`${type === "hidden" && "hidden"} ${className} max-w-full`}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input type={type || 'text'} readOnly={readOnly} disabled={disabled} placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
