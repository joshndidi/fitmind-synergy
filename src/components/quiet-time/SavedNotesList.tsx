
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Note = {
  id: string;
  content: string;
  created_at: string;
}

type SavedNotesListProps = {
  savedNotes: Note[];
  fetchNotes: () => Promise<void>;
}

export const SavedNotesList = ({ savedNotes, fetchNotes }: SavedNotesListProps) => {
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
  
  return (
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
  );
};
