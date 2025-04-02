
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LeaderboardEntry } from '@/types/supabase';

export const useLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        
        // Use a direct SQL query instead of the from() method to get the view data
        const { data, error } = await supabase
          .rpc('get_leaderboard_data')
          .order('total_weight', { ascending: false });

        if (error) {
          throw error;
        }

        setLeaderboardData(data || []);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  return { leaderboardData, loading, error };
};
