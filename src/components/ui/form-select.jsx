import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const FormSelect = ({ name, options, control, label, placeholder, description, className }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select  onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{options && options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
