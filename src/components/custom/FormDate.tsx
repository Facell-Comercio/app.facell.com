import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";

type FormDateProps = {
  name: string;
  control: Control<any>;
  label?: string;
  description?: string;
  disabled?: boolean;
  max?: Date;
  min?: Date;
  onChange?: (date: Date) => void;
  className?: string;
};

const FormDateInput = ({
  name,
  control,
  label,
  description,
  disabled,
  max,
  min,
  onChange,
  className,
}: FormDateProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex flex-col flex-1 min-w-[18ch] justify-end ${className}`}
        >
          {label && <FormLabel>{label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={disabled}
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "dd/MM/yyyy")
                  ) : (
                    <span>Selecione a data</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                locale={ptBR}
                onDayClick={(event) => {
                  field.onChange(event);
                  if (typeof onChange === "function") {
                    onChange(event);
                  }
                }}
                disabled={(date) => {
                  if (min && date < min) {
                    return true;
                  }
                  if (max && date > max) {
                    return true;
                  }
                  return date < new Date("1900-01-01");
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormDateInput;
