
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { QuietTimeSphere } from "@/components/QuietTimeSphere";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play, Pause, Save, Trash2, Music } from "lucide-react";

interface Note {
  id: string;
  content: string;
  created_at: string;
}

const QuietTime = () => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [currentSound, setCurrentSound] = useState<string>("/assets/meditation.mp3");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Available sounds
  const sounds = [
    { name: "Meditation", path: "/assets/meditation.mp3" },
    { name: "Nature Sounds", path: "/assets/nature-sounds.mp3" },
    { name: "Ambient", path: "/assets/ambient.mp3" }
  ];

  // Fetch user's saved notes when component mounts
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('quiet_time_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setNotes(data as Note[]);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load your notes');
    }
  };

  const handleSaveNote = async () => {
    if (!currentNote.trim()) {
      toast.error('Please enter a note before saving');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to save notes');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('quiet_time_notes')
        .insert([
          { user_id: user.id, content: currentNote }
        ]);
        
      if (error) throw error;
      
      toast.success('Note saved successfully');
      setCurrentNote('');
      fetchNotes(); // Refresh notes list
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save your note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('quiet_time_notes')
        .delete()
        .eq('id', noteId);
        
      if (error) throw error;
      
      // Update local state to remove deleted note
      setNotes(notes.filter(note => note.id !== noteId));
      toast.success('Note deleted');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSound = (soundPath: string) => {
    setCurrentSound(soundPath);
    setIsPlaying(false);
    
    // We need to wait for the audio element to update its src before playing
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiet Time</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="mb-6 glass-card">
            <CardHeader>
              <CardTitle>Meditation Space</CardTitle>
              <CardDescription>
                Take a moment to relax and clear your mind
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <QuietTimeSphere isActive={isPlaying} />
              
              <audio ref={audioRef} src={currentSound} loop />
              
              <div className="mt-8 flex flex-col items-center w-full">
                <Button 
                  onClick={togglePlayPause} 
                  className="mb-4 w-full md:w-40"
                  variant={isPlaying ? "destructive" : "default"}
                >
                  {isPlaying ? (
                    <><Pause className="mr-2 h-4 w-4" /> Pause</>
                  ) : (
                    <><Play className="mr-2 h-4 w-4" /> Play</>
                  )}
                </Button>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full mt-2">
                  {sounds.map((sound) => (
                    <Button
                      key={sound.path}
                      variant="outline"
                      className={currentSound === sound.path ? "border-primary" : ""}
                      onClick={() => changeSound(sound.path)}
                    >
                      <Music className="mr-2 h-4 w-4" />
                      {sound.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Journal</CardTitle>
              <CardDescription>
                Write down your thoughts during quiet time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What's on your mind during this quiet moment?"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="min-h-[150px] mb-4"
              />
              <Button 
                onClick={handleSaveNote} 
                disabled={!currentNote.trim() || !user}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" /> Save Note
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle>My Quiet Time Journal</CardTitle>
              <CardDescription>
                Your saved thoughts and reflections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                notes.length > 0 ? (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <Card key={note.id} className="p-4 relative group">
                        <p className="whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(note.created_at).toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>You don't have any saved notes yet.</p>
                    <p>Take a moment to reflect and save your thoughts.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>Please log in to save and view your notes.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuietTime;
