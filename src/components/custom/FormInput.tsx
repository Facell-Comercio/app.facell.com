import { cn } from '@/lib/utils';
import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

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

import * as React from "react";


export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input };

const FormInput = ({ name, type, control, label, placeholder, description, readOnly, disabled, className, onBlur }: IFormInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${type === "hidden" && "hidden"} ${className} max-w-full`}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input type={type || 'text'} readOnly={readOnly} disabled={typeof disabled==="undefined"?field.disabled:disabled} placeholder={placeholder} onBlur={typeof onBlur == "undefined"?field.onBlur:onBlur} onChange={field.onChange} value={field.value} name={field.name} ref={field.ref} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
