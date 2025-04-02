
-- Create a function to fetch leaderboard data
CREATE OR REPLACE FUNCTION public.get_leaderboard_data()
RETURNS TABLE (
  id uuid,
  display_name text,
  avatar_url text,
  country text,
  province text,
  total_weight bigint,
  workout_count bigint
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    p.id,
    p.display_name,
    p.avatar_url,
    p.country,
    p.province,
    COALESCE(SUM(cw.total_weight), 0)::bigint as total_weight,
    COUNT(cw.id)::bigint as workout_count
  FROM 
    profiles p
  LEFT JOIN 
    completed_workouts cw ON p.id = cw.user_id
  GROUP BY 
    p.id, p.display_name, p.avatar_url, p.country, p.province
  ORDER BY 
    total_weight DESC;
$$;

-- Set permissions for the function
GRANT EXECUTE ON FUNCTION public.get_leaderboard_data() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_leaderboard_data() TO anon;
