import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type InputDateProps = {
  disabled?: boolean;
  value?: Date;
  onChange: (date: Date) => void;
  className?: string;
};
export function InputDate({
  disabled,
  value,
  onChange,
  className,
}: InputDateProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            `w-[280px] justify-start text-left font-normal ${className}`,
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd/MM/yyyy") : <span>Selecione um dia</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(e) => onChange(e || new Date())}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
