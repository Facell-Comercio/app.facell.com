import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";

const FormInput = ({ name, type, control, label, placeholder, description, readOnly, disabled, className }) => {
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
