
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type NotesEditorProps = {
  fetchNotes: () => Promise<void>;
}

export const NotesEditor = ({ fetchNotes }: NotesEditorProps) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  
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
  
  return (
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
  );
};
