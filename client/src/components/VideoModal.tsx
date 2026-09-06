import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      const video = videoRef.current;
      
      // Auto-play when modal opens
      const autoPlay = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log('Auto-play failed:', error);
        }
      };

      // Add fullscreen handler for when user taps the video
      const handleFullscreen = async () => {
        try {
          if (video.requestFullscreen) {
            await video.requestFullscreen();
          } else if ((video as any).webkitRequestFullscreen) {
            (video as any).webkitRequestFullscreen();
          } else if ((video as any).webkitEnterFullscreen) {
            (video as any).webkitEnterFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen failed:', error);
        }
      };

      // Auto-play after short delay
      setTimeout(autoPlay, 100);
      
      // Add click listener for fullscreen
      video.addEventListener('click', handleFullscreen);
      video.addEventListener('touchstart', handleFullscreen);

      return () => {
        video.removeEventListener('click', handleFullscreen);
        video.removeEventListener('touchstart', handleFullscreen);
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-6 bg-background border-2 border-border">
        <DialogHeader>
          <DialogTitle className="font-grunge text-2xl uppercase mb-2">Launch Lifestyle App Demo</DialogTitle>
          <DialogDescription className="text-muted-foreground mb-4">
            See how our fitness app transforms your workout experience
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-foreground hover:bg-muted rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>
        
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-border">
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            controls
            muted
            autoPlay
            playsInline={false}
            preload="auto"
            poster=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          >
            <source src="/demo-final.mp4" type="video/mp4" />
            <p className="text-white p-4 text-center">
              Your browser doesn't support video playback.
            </p>
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}