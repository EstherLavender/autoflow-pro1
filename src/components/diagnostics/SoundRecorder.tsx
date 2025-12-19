import { useState, useRef } from 'react';
import { Mic, Square, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SoundRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isAnalyzing?: boolean;
}

export default function SoundRecorder({ onRecordingComplete, isAnalyzing }: SoundRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setHasRecording(true);
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasRecording(true);
      onRecordingComplete(file);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Recording Button */}
      <Card className={cn(
        "border-2 border-dashed transition-all",
        isRecording ? "border-destructive bg-destructive/5" : "border-border hover:border-primary/50"
      )}>
        <CardContent className="py-8 text-center">
          {isAnalyzing ? (
            <div className="space-y-3">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <p className="font-medium">Analyzing your recording...</p>
              <p className="text-sm text-muted-foreground">Our AI is listening carefully</p>
            </div>
          ) : isRecording ? (
            <div className="space-y-3">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto animate-pulse">
                <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center">
                  <Mic className="h-6 w-6 text-destructive-foreground" />
                </div>
              </div>
              <p className="font-medium text-destructive">Recording... {formatTime(recordingTime)}</p>
              <p className="text-sm text-muted-foreground">Tap to stop</p>
              <Button 
                variant="destructive" 
                size="lg" 
                onClick={stopRecording}
                className="mt-2"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop Recording
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={startRecording}
                className="h-20 w-20 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center mx-auto transition-all hover:scale-105"
              >
                <Mic className="h-10 w-10 text-primary" />
              </button>
              <p className="font-medium">Tap to Record</p>
              <p className="text-sm text-muted-foreground">
                Record the sound your car is making
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Option */}
      {!isRecording && !isAnalyzing && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
      )}

      {!isRecording && !isAnalyzing && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Audio File
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Tips */}
      {!isRecording && !isAnalyzing && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">
            For best results, record in a quiet environment with the engine running. 
            Hold your phone near the source of the sound.
          </p>
        </div>
      )}
    </div>
  );
}
