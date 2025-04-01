-- Create workout_plans table
CREATE TABLE IF NOT EXISTS workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    calories INTEGER,
    intensity TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_ai_generated BOOLEAN DEFAULT false,
    is_template BOOLEAN DEFAULT false
);

-- Create workout_exercises table
CREATE TABLE IF NOT EXISTS workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight DECIMAL,
    duration INTEGER, -- in seconds
    rest_time INTEGER, -- in seconds
    notes TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create workout_logs table
CREATE TABLE IF NOT EXISTS workout_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    calories_burned INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create workout_log_exercises table
CREATE TABLE IF NOT EXISTS workout_log_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_log_id UUID REFERENCES workout_logs(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    sets_completed INTEGER NOT NULL,
    reps_completed INTEGER NOT NULL,
    weight_used DECIMAL,
    duration_completed INTEGER, -- in seconds
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_log_exercises ENABLE ROW LEVEL SECURITY;

-- Policies for workout_plans
CREATE POLICY "Users can view their own workout plans"
    ON workout_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout plans"
    ON workout_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans"
    ON workout_plans FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans"
    ON workout_plans FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for workout_exercises
CREATE POLICY "Users can view exercises for their workout plans"
    ON workout_exercises FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workout_plans
            WHERE workout_plans.id = workout_exercises.workout_plan_id
            AND workout_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert exercises for their workout plans"
    ON workout_exercises FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workout_plans
            WHERE workout_plans.id = workout_exercises.workout_plan_id
            AND workout_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update exercises for their workout plans"
    ON workout_exercises FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workout_plans
            WHERE workout_plans.id = workout_exercises.workout_plan_id
            AND workout_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete exercises for their workout plans"
    ON workout_exercises FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workout_plans
            WHERE workout_plans.id = workout_exercises.workout_plan_id
            AND workout_plans.user_id = auth.uid()
        )
    );

-- Policies for workout_logs
CREATE POLICY "Users can view their own workout logs"
    ON workout_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs"
    ON workout_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs"
    ON workout_logs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout logs"
    ON workout_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for workout_log_exercises
CREATE POLICY "Users can view exercises for their workout logs"
    ON workout_log_exercises FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workout_logs
            WHERE workout_logs.id = workout_log_exercises.workout_log_id
            AND workout_logs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert exercises for their workout logs"
    ON workout_log_exercises FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workout_logs
            WHERE workout_logs.id = workout_log_exercises.workout_log_id
            AND workout_logs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update exercises for their workout logs"
    ON workout_log_exercises FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workout_logs
            WHERE workout_logs.id = workout_log_exercises.workout_log_id
            AND workout_logs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete exercises for their workout logs"
    ON workout_log_exercises FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workout_logs
            WHERE workout_logs.id = workout_log_exercises.workout_log_id
            AND workout_logs.user_id = auth.uid()
        )
    );

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_workout_plans_updated_at
    BEFORE UPDATE ON workout_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 