
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type WorkoutDatePickerProps = {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
};

const WorkoutDatePicker = ({ date, onDateChange }: WorkoutDatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left border-white/10",
            !date && "text-text-muted"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 pointer-events-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && onDateChange(date)}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default WorkoutDatePicker;
