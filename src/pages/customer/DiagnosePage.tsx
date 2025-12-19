import { useState } from 'react';
import { ArrowLeft, Mic, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomerLayout from '@/components/layout/CustomerLayout';
import SoundRecorder from '@/components/diagnostics/SoundRecorder';
import DiagnosisResult from '@/components/diagnostics/DiagnosisResult';
import { mockVehicles, mockDiagnoses } from '@/data/mockData';
import { AIDiagnosis } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function DiagnosePage() {
  const navigate = useNavigate();
  const customerId = '3';
  const vehicles = mockVehicles.filter(v => v.customerId === customerId);
  
  const [step, setStep] = useState<'record' | 'analyzing' | 'result'>('record');
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]?.id || '');
  const [description, setDescription] = useState('');
  const [diagnosis, setDiagnosis] = useState<AIDiagnosis | null>(null);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setStep('analyzing');
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return mock diagnosis
    const mockResult: AIDiagnosis = {
      id: 'new-' + Date.now(),
      vehicleId: selectedVehicle,
      customerId,
      description,
      category: 'brakes',
      urgency: 'medium',
      explanation: 'Based on the sound you recorded, this appears to be worn brake pads. The squeaking occurs when the wear indicator contacts the rotor, signaling it\'s time for replacement. This is a common maintenance item and not an emergency.',
      recommendation: 'schedule_service',
      recommendedServices: ['4'],
      createdAt: new Date(),
    };
    
    setDiagnosis(mockResult);
    setStep('result');
  };

  return (
    <CustomerLayout 
      title={step === 'result' ? 'Diagnosis Results' : "What's That Sound?"} 
      subtitle={step === 'result' ? 'Here\'s what we found' : 'Let our AI help identify the issue'}
    >
      {step === 'record' && (
        <div className="space-y-5">
          {/* Vehicle Selection */}
          <div className="space-y-2">
            <Label>Which vehicle?</Label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      {v.make} {v.model} - {v.licensePlate}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Describe the sound (optional)</Label>
            <Textarea
              placeholder="e.g., Squeaking when I brake, rattling at high speeds..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Sound Recorder */}
          <SoundRecorder 
            onRecordingComplete={handleRecordingComplete}
            isAnalyzing={step === 'analyzing'}
          />
        </div>
      )}

      {step === 'analyzing' && (
        <SoundRecorder 
          onRecordingComplete={() => {}}
          isAnalyzing={true}
        />
      )}

      {step === 'result' && diagnosis && (
        <DiagnosisResult
          diagnosis={diagnosis}
          onFindGarage={() => navigate('/customer/garages')}
          onScheduleService={() => navigate('/customer/book')}
        />
      )}

      {step === 'result' && (
        <Button 
          variant="ghost" 
          className="w-full mt-4" 
          onClick={() => {
            setStep('record');
            setDiagnosis(null);
          }}
        >
          Record Another Sound
        </Button>
      )}
    </CustomerLayout>
  );
}
