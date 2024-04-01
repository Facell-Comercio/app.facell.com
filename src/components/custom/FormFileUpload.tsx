import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FileUpload } from './FileUpload';
import { MediaType } from '@/types/mediaTypes';

interface FormFileUploadProps {
  name: string
  control: Control<any>
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  mediaType: MediaType
}

const FormFileUpload = ({ name, mediaType, control, label, description, disabled, className }: FormFileUploadProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem  className={`${className}`}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <FileUpload 
              value={field.value}
              onChange={field.onChange}
              mediaType={mediaType}
              disabled={disabled}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFileUpload;
