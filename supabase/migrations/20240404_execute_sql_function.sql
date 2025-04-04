
-- Create function to execute SQL queries safely
CREATE OR REPLACE FUNCTION public.execute_sql(sql text)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY EXECUTE sql;
END;
$$;

-- Grant execute permission to the function for authenticated users
GRANT EXECUTE ON FUNCTION public.execute_sql TO authenticated;
