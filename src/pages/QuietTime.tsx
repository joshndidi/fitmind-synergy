
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Save, Music, VolumeX, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import QuietTimeSphere from '../components/QuietTimeSphere';

const QuietTime = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColor, setCurrentColor] = useState("#4CAF50"); // Green default
  const [isMuted, setIsMuted] = useState(false);
  const [note, setNote] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSource, setAudioSource] = useState('');

  // Mock audio tracks for different colors
  const audioTracks = {
    "#4CAF50": "/nature-sounds.mp3", // Green - Nature sounds (hypothetical file)
    "#2196F3": "/meditation.mp3", // Blue - Meditation (hypothetical file)
    "#9C27B0": "/ambient.mp3", // Purple - Ambient (hypothetical file)
  };

  useEffect(() => {
    // In a real implementation, these would be actual audio files
    // For this mock, we'll just simulate changing tracks
    if (isPlaying) {
      toast.info(`Playing ${currentColor === "#4CAF50" ? "Nature Sounds" : 
                          currentColor === "#2196F3" ? "Meditation Music" : 
                          "Ambient Sounds"}`);
    }
    
    // Set the audio source based on the current color
    setAudioSource(audioTracks[currentColor as keyof typeof audioTracks]);
    
    // If we were actually playing audio and changed the color, restart it
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    }
  }, [currentColor, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Start playing (in a real implementation)
      toast.info("Music started");
    } else {
      // Pause playing (in a real implementation)
      toast.info("Music paused");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const saveNote = () => {
    if (note.trim()) {
      // In a real implementation, this would save the note to a database
      // with encryption for privacy
      toast.success("Note saved securely");
      setNote('');
    } else {
      toast.error("Please enter a note before saving");
    }
  };

  const colorOptions = [
    { name: "Calm", color: "#4CAF50", description: "Nature sounds for relaxation" },
    { name: "Focus", color: "#2196F3", description: "Meditation music for concentration" },
    { name: "Dream", color: "#9C27B0", description: "Ambient sounds for creativity" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-text-light">Quiet Time</h1>
      <p className="text-text-muted mb-8">
        Take a moment for yourself. Focus on your mental wellness with calming sounds and private journaling.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sphere and controls */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="relative mb-8 w-full flex justify-center">
            <QuietTimeSphere 
              color={currentColor} 
              isPlaying={isPlaying}
              onClick={togglePlay}
            />
            
            {/* Hidden audio element */}
            <audio ref={audioRef} loop>
              <source src={audioSource} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              className={`bg-primary text-white px-8`}
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            
            <Button 
              variant="outline" 
              className="border-white/10 text-text-light hover:bg-white/5"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
              {isMuted ? "Unmute" : "Mute"}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {colorOptions.map((option) => (
              <Card 
                key={option.color}
                className={`glass-card cursor-pointer transition-all ${
                  currentColor === option.color ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setCurrentColor(option.color)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: option.color }}
                  />
                  <div>
                    <h3 className="font-medium text-text-light">{option.name}</h3>
                    <p className="text-text-muted text-xs">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Private notes section */}
        <div>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-text-light flex items-center gap-2">
                <Music className="h-5 w-5" /> Private Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-text-muted text-sm">
                Your thoughts are private. All notes are encrypted and only accessible to you.
              </p>
              
              <textarea
                className="w-full h-64 bg-black/30 border border-white/10 rounded-md p-3 text-text-light"
                placeholder="Write your private thoughts here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              
              <Button 
                className="w-full bg-primary text-white"
                onClick={saveNote}
              >
                <Save className="mr-2 h-4 w-4" /> Save Note
              </Button>
              
              <div className="pt-4 border-t border-white/10">
                <h3 className="font-medium text-text-light mb-2">Session Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Current Session</span>
                    <span className="text-text-light">12:43</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Total This Week</span>
                    <span className="text-text-light">2h 35m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Longest Session</span>
                    <span className="text-text-light">45m 12s</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="glass-card mt-8">
        <CardHeader>
          <CardTitle className="text-text-light">Mental Wellness Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Deep Breathing", content: "Practice 4-7-8 breathing: Inhale for 4 seconds, hold for 7, exhale for 8." },
              { title: "Mindful Observation", content: "Focus on one object for five minutes, noting every detail without judgment." },
              { title: "Body Scan", content: "Mentally scan your body from head to toe, releasing tension as you go." }
            ].map((tip, index) => (
              <div key={index} className="glass-card p-4">
                <h3 className="font-medium text-text-light mb-2">{tip.title}</h3>
                <p className="text-text-muted text-sm">{tip.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuietTime;
