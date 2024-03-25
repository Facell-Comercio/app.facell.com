import { UseFormRegister } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface IFormInput {
  name: string,
  type?: string,
  register: UseFormRegister<any>,
  label?: string,
  placeholder?: string,
  description?: string,
  readOnly?: boolean,
  disabled?: boolean,
  className?: string
}

const FormInputUncontrolled = ({ name, register, type, label, placeholder, description, readOnly, disabled, className }: IFormInput) => {
  return (
        <FormItem className={`${type === "hidden" && "hidden"}`}>
          {label && <FormLabel>{label}</FormLabel>}

          <Input {...register(name)} className={className} type={type || 'text'} step={'0.01'} readOnly={readOnly} disabled={disabled} placeholder={placeholder} />

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
  );
};

export default FormInputUncontrolled;
