
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

const LocationProfileForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load current location data
  useEffect(() => {
    const loadLocationData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("country, province")
          .eq("id", user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setCountry(data.country || "");
          setProvince(data.province || "");
        }
      } catch (error) {
        console.error("Error loading location data:", error);
      } finally {
        setInitialLoad(false);
      }
    };
    
    loadLocationData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to update your location");
      return;
    }
    
    if (!country.trim()) {
      toast.error("Country is required");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          country: country.trim(),
          province: province.trim() || null
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast.success("Location updated successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return <div className="p-4 text-center text-text-muted">Loading location data...</div>;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Update Your Location
        </CardTitle>
        <CardDescription>
          Your location helps us show you relevant leaderboards and connect you with nearby users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter your country"
              required
              className="bg-black/40"
            />
          </div>
          
          <div>
            <Label htmlFor="province">State/Province (Optional)</Label>
            <Input
              id="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Enter your state or province"
              className="bg-black/40"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Location"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LocationProfileForm;
