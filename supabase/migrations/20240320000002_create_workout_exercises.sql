-- Create workout_exercises table
CREATE TABLE workout_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL,
  duration INTEGER,
  rest_time INTEGER,
  notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX workout_exercises_workout_plan_id_idx ON workout_exercises(workout_plan_id);

-- Enable Row Level Security
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own workout exercises"
  ON workout_exercises
  FOR SELECT
  USING (
    workout_plan_id IN (
      SELECT id FROM workout_plans WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create workout exercises for their own workout plans"
  ON workout_exercises
  FOR INSERT
  WITH CHECK (
    workout_plan_id IN (
      SELECT id FROM workout_plans WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own workout exercises"
  ON workout_exercises
  FOR UPDATE
  USING (
    workout_plan_id IN (
      SELECT id FROM workout_plans WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    workout_plan_id IN (
      SELECT id FROM workout_plans WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own workout exercises"
  ON workout_exercises
  FOR DELETE
  USING (
    workout_plan_id IN (
      SELECT id FROM workout_plans WHERE user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_workout_exercises_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_workout_exercises_updated_at
  BEFORE UPDATE ON workout_exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_workout_exercises_updated_at(); 