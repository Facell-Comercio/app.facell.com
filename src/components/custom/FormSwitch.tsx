import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Switch } from '../ui/switch';

interface IFormSwitch { 
  name: string, 
  type?: string, 
  control: Control<any>, 
  label?: string, 
  disabled?: boolean, 
  className?: string, 
  onChange?: (val:any)=>void
}


const FormSwitch = ({ name, control, label, className, disabled, onChange }: IFormSwitch) => {
  return (
    <FormField
              control={control}
              name={name}
              render={({ field }) => (
                <FormItem className={`flex gap-2 items-center justify-center ${className}`}>
                  {label && <FormLabel >{label}</FormLabel>}
                  <FormControl>
                    <Switch
                      checked={!!+field.value}
                      onCheckedChange={(checked:boolean)=>{
                        field.onChange(checked)
                        if(onChange !== undefined){
                          onChange(checked)
                        }
                      }}
                      disabled={disabled}
                      className='mt-0'
                      defaultChecked={true}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
  );
};

export default FormSwitch;
