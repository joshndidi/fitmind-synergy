
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useWorkout } from "@/hooks/useWorkout";
import { format, isSameDay } from "date-fns";
import { Dumbbell } from "lucide-react";

const WorkoutCalendar = () => {
  const { loggedWorkouts } = useWorkout();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Group workouts by date
  const workoutsByDate = loggedWorkouts.reduce((acc, workout) => {
    const dateStr = format(workout.date, 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(workout);
    return acc;
  }, {} as Record<string, typeof loggedWorkouts>);
  
  // Get workouts for selected date
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const workoutsForSelectedDate = workoutsByDate[selectedDateStr] || [];
  
  // Highlight dates with workouts
  const isDayWithWorkout = (day: Date) => {
    return Object.keys(workoutsByDate).some(dateStr => {
      const date = new Date(dateStr);
      return isSameDay(date, day);
    });
  };
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-text-light">Workout Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-white/10 p-3 pointer-events-auto"
              modifiers={{
                workout: (date) => isDayWithWorkout(date),
              }}
              modifiersClassNames={{
                workout: "border-2 border-primary/50 bg-primary/10",
              }}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-text-light font-medium text-lg">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            
            {workoutsForSelectedDate.length === 0 ? (
              <div className="text-text-muted text-center py-8">
                No workouts logged for this date
              </div>
            ) : (
              <div className="space-y-3">
                {workoutsForSelectedDate.map((workout) => (
                  <div key={workout.id} className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Dumbbell className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-medium text-text-light">{workout.title}</h4>
                    </div>
                    
                    <div className="text-text-muted text-sm mb-3">
                      {workout.exercises.length} exercises • {workout.totalWeight.toLocaleString()} kg total
                    </div>
                    
                    <div className="space-y-2">
                      {workout.exercises.map((exercise, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-text-light">{exercise.name}</span>
                          <span className="text-text-muted">
                            {exercise.sets} × {exercise.reps} × {exercise.weight} kg
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutCalendar;
