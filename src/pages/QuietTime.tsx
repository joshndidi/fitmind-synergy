
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Save, Music, VolumeX, Volume2, SkipForward, SkipBack, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Slider } from "@/components/ui/slider";
import QuietTimeSphere from '../components/QuietTimeSphere';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Define the music tracks
const MUSIC_TRACKS = [
  {
    name: "Calm Meditation",
    src: "https://assets.mixkit.co/music/preview/mixkit-spirit-meditation-383.mp3",
    color: "#4CAF50",
    category: "meditation"
  },
  {
    name: "Deep Focus",
    src: "https://assets.mixkit.co/music/preview/mixkit-comforting-ambience-with-piano-494.mp3",
    color: "#2196F3",
    category: "focus"
  },
  {
    name: "Dreamy Ambience",
    src: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    color: "#9C27B0",
    category: "ambient"
  },
  {
    name: "Nature Sounds",
    src: "https://assets.mixkit.co/music/preview/mixkit-forest-stream-ambience-1186.mp3",
    color: "#4CAF50",
    category: "nature"
  },
  {
    name: "Ocean Waves",
    src: "https://assets.mixkit.co/music/preview/mixkit-calming-night-sounds-122.mp3",
    color: "#2196F3",
    category: "nature"
  },
  {
    name: "Peaceful Piano",
    src: "https://assets.mixkit.co/music/preview/mixkit-reflective-piano-beat-547.mp3",
    color: "#9C27B0",
    category: "focus"
  }
];

const QuietTime = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColor, setCurrentColor] = useState("#4CAF50"); // Green default
  const [isMuted, setIsMuted] = useState(false);
  const [note, setNote] = useState('');
  const [volume, setVolume] = useState(80);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter tracks by category
  const filteredTracks = selectedCategory === "all" 
    ? MUSIC_TRACKS 
    : MUSIC_TRACKS.filter(track => track.category === selectedCategory);

  useEffect(() => {
    // Set up the audio element
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.loop = loopEnabled;
      
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Audio play failed:", err);
          toast.error("Failed to play audio. Please try again.");
          setIsPlaying(false);
        });
        
        // Start session timer
        timerRef.current = setInterval(() => {
          setSessionTime(prev => prev + 1);
        }, 1000);
      } else {
        audioRef.current.pause();
        
        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }

    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, volume, loopEnabled]);

  useEffect(() => {
    // Update current color based on the selected track
    setCurrentColor(filteredTracks[currentTrackIndex]?.color || "#4CAF50");
    
    // When track changes, load the new audio
    if (audioRef.current) {
      audioRef.current.src = filteredTracks[currentTrackIndex]?.src || "";
      audioRef.current.load();
      
      // If it was playing, continue playing the new track
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      }
    }
  }, [currentTrackIndex, filteredTracks]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      toast.info(`Playing ${filteredTracks[currentTrackIndex]?.name || "Music"}`);
    } else {
      toast.info("Music paused");
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      setIsMuted(newMuteState);
      audioRef.current.muted = newMuteState;
      
      toast.info(newMuteState ? "Sound muted" : "Sound unmuted");
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % filteredTracks.length;
    setCurrentTrackIndex(nextIndex);
    toast.info(`Playing: ${filteredTracks[nextIndex]?.name}`);
  };

  const playPreviousTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + filteredTracks.length) % filteredTracks.length;
    setCurrentTrackIndex(prevIndex);
    toast.info(`Playing: ${filteredTracks[prevIndex]?.name}`);
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setCurrentTrackIndex(0); // Reset to first track in the new category
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-text-light">Quiet Time</h1>
      <p className="text-text-muted mb-8">
        Take a moment for yourself. Focus on your mental wellness with calming sounds and private journaling.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sphere and controls */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="relative mb-4 w-full flex justify-center">
            <QuietTimeSphere 
              color={currentColor} 
              isPlaying={isPlaying}
              onClick={togglePlay}
            />
            
            {/* Hidden audio element */}
            <audio 
              ref={audioRef} 
              loop={loopEnabled} 
              onEnded={loopEnabled ? undefined : playNextTrack}
            >
              <source src={filteredTracks[currentTrackIndex]?.src} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
          
          <div className="w-full max-w-md mb-8">
            <h3 className="font-medium text-text-light text-center mb-2">
              {isPlaying ? "Now Playing: " : "Selected: "}
              {filteredTracks[currentTrackIndex]?.name || "No track selected"}
            </h3>
            
            {/* Session timer */}
            <div className="flex items-center justify-center text-text-light mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>Session time: {formatTime(sessionTime)}</span>
            </div>
            
            {/* Audio controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Button 
                variant="outline" 
                size="icon"
                className="border-white/10 text-text-light hover:bg-white/5"
                onClick={playPreviousTrack}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                className={`bg-primary text-white px-8`}
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className="border-white/10 text-text-light hover:bg-white/5"
                onClick={playNextTrack}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Volume slider */}
            <div className="flex items-center gap-3 mb-6 px-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-text-light hover:bg-white/5"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
              
              <span className="text-text-light text-sm min-w-[30px]">
                {volume}%
              </span>
            </div>
            
            {/* Loop toggle */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-text-light text-sm">Loop track</span>
              <Switch 
                checked={loopEnabled} 
                onCheckedChange={setLoopEnabled} 
              />
            </div>
            
            {/* Music category filter */}
            <div className="mb-6 flex justify-center">
              <ToggleGroup 
                type="single" 
                value={selectedCategory}
                onValueChange={(value) => {
                  if (value) handleCategoryChange(value);
                }}
                className="bg-black/30 rounded-lg p-1"
              >
                <ToggleGroupItem value="all" className="text-sm">
                  All
                </ToggleGroupItem>
                <ToggleGroupItem value="meditation" className="text-sm">
                  Meditation
                </ToggleGroupItem>
                <ToggleGroupItem value="focus" className="text-sm">
                  Focus
                </ToggleGroupItem>
                <ToggleGroupItem value="nature" className="text-sm">
                  Nature
                </ToggleGroupItem>
                <ToggleGroupItem value="ambient" className="text-sm">
                  Ambient
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          {/* Track selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {filteredTracks.map((track, index) => (
              <Card 
                key={track.src}
                className={`glass-card cursor-pointer transition-all ${
                  currentTrackIndex === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setCurrentTrackIndex(index)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: track.color }}
                  />
                  <div>
                    <h3 className="font-medium text-text-light">{track.name}</h3>
                    <p className="text-text-muted text-xs capitalize">{track.category}</p>
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
                    <span className="text-text-light">{formatTime(sessionTime)}</span>
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
