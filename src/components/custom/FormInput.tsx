import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from '../ui/input';

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
  onBlur?: (e:React.FocusEvent<HTMLInputElement>) => void
}

const FormInput = ({ name, type, control, label, placeholder, description, readOnly, disabled, className, onBlur }: IFormInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${type === "hidden" && "hidden"} ${className} max-w-full`}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input type={type || 'text'} readOnly={readOnly} disabled={typeof disabled==="undefined"?field.disabled:disabled} placeholder={placeholder} onBlur={typeof onBlur === "undefined"?field.onBlur:()=> onBlur} onChange={field.onChange} value={field.value} name={field.name} ref={field.ref} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
