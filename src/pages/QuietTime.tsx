
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { QuietTimeSphere } from '../components/QuietTimeSphere';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Note {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  title: string;
}

const QuietTime = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage] = useState(3);
  
  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quiet_time_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data as Note[]);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.content.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    try {
      const { error } = await supabase.from('quiet_time_notes').insert([
        {
          user_id: user?.id,
          title: newNote.title || 'Untitled Note',
          content: newNote.content,
        },
      ]);

      if (error) throw error;
      
      setNewNote({ title: '', content: '' });
      setShowAddNote(false);
      fetchNotes();
      toast.success('Note saved successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNote.content.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('quiet_time_notes')
        .update({
          title: editingNote.title || 'Untitled Note',
          content: editingNote.content,
        })
        .eq('id', editingNote.id);

      if (error) throw error;
      
      setEditingNote(null);
      fetchNotes();
      toast.success('Note updated successfully');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const { error } = await supabase
        .from('quiet_time_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchNotes();
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  // Pagination logic
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(notes.length / notesPerPage);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Quiet Time</h1>
        <p className="text-text-muted">A peaceful space for reflection and mindfulness</p>
      </div>

      <div className="glass-card mb-8 p-8 text-center flex flex-col items-center">
        <QuietTimeSphere />
        <h2 className="text-xl font-bold text-text-light mt-6 mb-2">Take a moment to breathe</h2>
        <p className="text-text-muted mb-4 max-w-md">
          Focus on your breathing, let your thoughts settle, and center yourself in the present moment.
        </p>
      </div>

      {/* Notes Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-light">Your Notes</h2>
          {!showAddNote && (
            <Button 
              onClick={() => setShowAddNote(true)} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Note
            </Button>
          )}
        </div>

        {/* Add Note Form */}
        {showAddNote && (
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle>New Note</CardTitle>
              <CardDescription>Capture your thoughts and reflections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title (Optional)</Label>
                  <Input
                    id="title"
                    placeholder="Title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your note here..."
                    rows={5}
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowAddNote(false);
                  setNewNote({ title: '', content: '' });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddNote}>Save Note</Button>
            </CardFooter>
          </Card>
        )}

        {/* Notes List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : currentNotes.length > 0 ? (
          <div className="space-y-4">
            {currentNotes.map((note) => (
              <Card key={note.id} className="glass-card">
                {editingNote?.id === note.id ? (
                  // Edit Mode
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`edit-title-${note.id}`}>Title</Label>
                        <Input
                          id={`edit-title-${note.id}`}
                          value={editingNote.title}
                          onChange={(e) => setEditingNote({
                            ...editingNote,
                            title: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-content-${note.id}`}>Content</Label>
                        <Textarea
                          id={`edit-content-${note.id}`}
                          rows={5}
                          value={editingNote.content}
                          onChange={(e) => setEditingNote({
                            ...editingNote,
                            content: e.target.value
                          })}
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingNote(null)}
                        >
                          <X size={16} className="mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleUpdateNote}
                        >
                          <Check size={16} className="mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  // View Mode
                  <>
                    <CardHeader>
                      <CardTitle>{note.title || 'Untitled Note'}</CardTitle>
                      <CardDescription>
                        {new Date(note.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingNote(note)}
                      >
                        <Edit2 size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-text-muted">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-text-muted mb-4">You haven't created any notes yet.</p>
            <Button onClick={() => setShowAddNote(true)}>Create Your First Note</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuietTime;
