import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FileUpload } from './FileUpload';
import { MediaType } from '@/types/media-type';

interface FormFileUploadProps {
  name: string
  control: Control<any>
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  mediaType: MediaType
  canDelete?: boolean
  onChange?: (any: any) => void
}

const FormFileUpload = ({ canDelete, name, mediaType, control, label, description, disabled, className, onChange }: FormFileUploadProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${className}`}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <FileUpload
              canDelete={canDelete}
              value={field.value}
              onChange={(event) => {
                if (typeof onChange === 'function') {
                  onChange(event)
                  field.onChange(event)
                  return
                }
                field.onChange(event)
              }
              }
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
