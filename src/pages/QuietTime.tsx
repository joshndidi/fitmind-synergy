import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { QuietTimeSphere } from "@/components/QuietTimeSphere";
import { Play, Pause, Save, Trash, Music, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const QuietTime = () => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<Array<{ id: string, content: string, created_at: string }>>([]);
  const [loading, setLoading] = useState(false);
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
  
  const saveNote = async () => {
    if (!notes.trim()) {
      toast.error("Please enter some notes to save");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to save notes");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('quiet_time_notes')
        .insert([
          { user_id: user.id, content: notes }
        ])
        .select();
        
      if (error) throw error;
      
      toast.success("Notes saved successfully");
      setNotes("");
      fetchNotes();
    } catch (error: any) {
      console.error('Error saving note:', error.message);
      toast.error("Failed to save note");
    } finally {
      setLoading(false);
    }
  };
  
  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quiet_time_notes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Note deleted successfully");
      fetchNotes();
    } catch (error: any) {
      console.error('Error deleting note:', error.message);
      toast.error("Failed to delete note");
    }
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const audioOptions = [
    { name: "Ambient", src: "/assets/ambient.mp3" },
    { name: "Meditation", src: "/assets/meditation.mp3" },
    { name: "Nature", src: "/assets/nature-sounds.mp3" }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text-light">Quiet Time</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-text-light">Mindfulness Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <QuietTimeSphere isPlaying={isPlaying} audioSource={audioSource} volume={volume} />
              
              <div className="mt-8 space-y-6 w-full max-w-md">
                <div className="flex justify-center">
                  <Button 
                    className={`${isPlaying ? 'bg-destructive text-white' : 'bg-primary text-white'} rounded-full w-16 h-16 flex items-center justify-center`}
                    onClick={togglePlayback}
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Volume2 className="mr-2 text-text-muted" />
                      <span className="text-text-light">Volume</span>
                    </div>
                    <span className="text-text-light">{volume}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Music className="mr-2 text-text-muted" />
                    <span className="text-text-light">Audio Tracks</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {audioOptions.map((option) => (
                      <Button
                        key={option.name}
                        variant={audioSource === option.src ? "default" : "outline"}
                        className={audioSource === option.src ? "bg-primary text-white" : "border-white/10"}
                        onClick={() => setAudioSource(option.src)}
                      >
                        {option.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-text-light font-medium">Reflection Notes</h3>
              <Textarea
                placeholder="Write your thoughts and reflections here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px]"
              />
              <Button 
                onClick={saveNote} 
                disabled={loading}
                className="bg-primary text-white"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Notes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card h-fit">
          <CardHeader>
            <CardTitle className="text-text-light">Saved Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedNotes.length > 0 ? (
                savedNotes.map((note) => (
                  <div key={note.id} className="glass-card-hover p-4 relative group">
                    <p className="text-text-light text-sm whitespace-pre-wrap">{note.content}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-text-muted text-xs">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-muted">No saved notes yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuietTime;
