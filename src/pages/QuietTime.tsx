
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AudioControls } from "@/components/quiet-time/AudioControls";
import { NotesEditor } from "@/components/quiet-time/NotesEditor";
import { SavedNotesList } from "@/components/quiet-time/SavedNotesList";

type Note = {
  id: string;
  content: string;
  created_at: string;
}

const QuietTime = () => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [audioSource, setAudioSource] = useState("/assets/ambient.mp3");
  
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);
  
  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quiet_time_notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setSavedNotes(data || []);
    } catch (error: any) {
      console.error('Error fetching notes:', error.message);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text-light">Quiet Time</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-text-light">Mindfulness Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AudioControls 
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              volume={volume}
              setVolume={setVolume}
              audioSource={audioSource}
              setAudioSource={setAudioSource}
            />
            
            <NotesEditor fetchNotes={fetchNotes} />
          </CardContent>
        </Card>
        
        <SavedNotesList 
          savedNotes={savedNotes}
          fetchNotes={fetchNotes}
        />
      </div>
    </div>
  );
};

export default QuietTime;
