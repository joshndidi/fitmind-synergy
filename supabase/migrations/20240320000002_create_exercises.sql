-- Create exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  equipment TEXT[] NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT[] NOT NULL,
  tips TEXT[] NOT NULL,
  variations TEXT[] NOT NULL,
  video_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read exercises
CREATE POLICY "Allow public read access to exercises"
  ON exercises FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only allow authenticated users to insert exercises
CREATE POLICY "Allow authenticated users to insert exercises"
  ON exercises FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only allow authenticated users to update exercises
CREATE POLICY "Allow authenticated users to update exercises"
  ON exercises FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only allow authenticated users to delete exercises
CREATE POLICY "Allow authenticated users to delete exercises"
  ON exercises FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial exercises
INSERT INTO exercises (
  name,
  category,
  muscle_group,
  difficulty,
  equipment,
  description,
  instructions,
  tips,
  variations,
  video_url,
  image_url
) VALUES
(
  'Bench Press',
  'Strength',
  'Chest',
  'intermediate',
  ARRAY['Barbell', 'Bench'],
  'A compound exercise that primarily targets the chest muscles, shoulders, and triceps.',
  ARRAY[
    'Lie on the bench with your feet flat on the ground',
    'Grip the barbell slightly wider than shoulder width',
    'Lower the bar to your chest',
    'Push the bar back up to the starting position'
  ],
  ARRAY[
    'Keep your back flat against the bench',
    'Breathe out when pushing up',
    'Keep your wrists straight'
  ],
  ARRAY[
    'Dumbbell Bench Press',
    'Incline Bench Press',
    'Decline Bench Press'
  ],
  'https://example.com/bench-press',
  'https://example.com/bench-press.jpg'
),
(
  'Squats',
  'Strength',
  'Legs',
  'beginner',
  ARRAY['Bodyweight', 'Barbell'],
  'A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes.',
  ARRAY[
    'Stand with feet shoulder-width apart',
    'Lower your body by bending your knees',
    'Keep your back straight',
    'Return to standing position'
  ],
  ARRAY[
    'Keep your knees aligned with your toes',
    'Maintain a neutral spine',
    'Engage your core'
  ],
  ARRAY[
    'Goblet Squats',
    'Front Squats',
    'Bulgarian Split Squats'
  ],
  'https://example.com/squats',
  'https://example.com/squats.jpg'
); 