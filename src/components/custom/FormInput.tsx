import { Control, UseFormRegister } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from '../ui/input';

interface IFormInput {
  name: string,
  type?: string,
  control?: Control<any>,
  register?: UseFormRegister<any>,
  label?: string,
  placeholder?: string,
  description?: string,
  readOnly?: boolean,
  disabled?: boolean,
  className?: string
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  fnMask?: (val:string)=>void
}

const FormInput = ({ name, type, control, register, label, placeholder, description, readOnly, disabled, className, onBlur, onChange, fnMask = (val)=>{return val} }: IFormInput) => {

  if(typeof register !== 'undefined'){
    return (
      <FormItem className={`${type === "hidden" && "hidden"} ${className} flex-1`}>
          {label && <FormLabel className='text-nowrap'>{label}</FormLabel>}
          <FormControl>
            <Input
              {...register(name, {
                onBlur: (e)=>fnMask(e.target.value)
              })}
              type={type || 'text'}
              placeholder={placeholder}
              readOnly={readOnly}
              disabled={disabled}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
    )
  }

if(typeof control !== 'undefined') {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${type === "hidden" && "hidden"} ${className}`}>
          {label && <FormLabel className='text-nowrap'>{label}</FormLabel>}
          <FormControl>
            <Input
              className={className}
              ref={field.ref}
              type={type || 'text'}
              name={field.name}
              value={typeof fnMask === 'function' ? fnMask(field.value) : field.value}
              placeholder={placeholder}
              readOnly={readOnly}
              disabled={typeof disabled === "undefined" ? field.disabled : disabled}
              onBlur={typeof onBlur == "undefined" ? field.onBlur : onBlur}
              onChange={typeof onChange == "undefined" ? field.onChange : onChange}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )};
  return <p>Precisa prover Control ou Register</p>
};

export default FormInput;
