"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle, Video, Copy, Check } from "lucide-react";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  
  // State for the copy button feedback
  const [copied, setCopied] = useState(false);

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to join room");
      }

      setToken(data.token);
      setHasJoined(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ---------------------------------------------------------------------------
  // STATE 1: The Active Video Call
  // ---------------------------------------------------------------------------
  if (hasJoined && token) {
    return (
      <div className="h-screen w-full bg-[#030305] text-white relative">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default" 
          style={{ height: "100dvh" }}
          connect={true} // Helps stabilize Strict Mode connection errors
          onDisconnected={() => router.push("/")} // Navigates home when you click Leave
        >
          {/* Floating Share Button */}
          <div className="absolute top-6 left-6 z-50">
            <Button 
              onClick={copyInviteLink} 
              variant="secondary" 
              className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700 text-white hover:bg-zinc-800 transition-all shadow-lg rounded-full px-5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2 text-cyan-400" />
                  Copy Invite Link
                </>
              )}
            </Button>
          </div>

          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // STATE 2: The Pre-Join Lobby
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030305] text-white p-4 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] -z-10"></div>

      <Card className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl border-zinc-800 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/30">
            <Video className="w-6 h-6 text-indigo-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Join Secure Meeting</CardTitle>
          <CardDescription className="text-zinc-400">
            Room ID: <span className="font-mono text-cyan-400">{roomId.slice(0, 8)}...</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={joinRoom} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                Enter your display name
              </label>
              <Input
                id="name"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. John Doe"
                disabled={isLoading}
                className="h-12 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-lg font-medium transition-all"
              disabled={isLoading || !username.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting securely...
                </>
              ) : (
                "Join Meeting"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}