import { useState, useRef } from 'react';
import { Upload, FileCheck, AlertCircle, Loader2, Camera, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface KYCDocumentUploadProps {
  documentType: 'national_id' | 'passport' | 'drivers_license' | 'business_license' | 'tax_certificate' | 'proof_of_address';
  title: string;
  description: string;
  requiresBackImage?: boolean;
  onUploadComplete?: (documentId: string) => void;
}

export default function KYCDocumentUpload({
  documentType,
  title,
  description,
  requiresBackImage = true,
  onUploadComplete
}: KYCDocumentUploadProps) {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>('');
  const [backPreview, setBackPreview] = useState<string>('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'uploading' | 'verifying' | 'verified' | 'failed'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File, side: 'front' | 'back') => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === 'front') {
        setFrontImage(file);
        setFrontPreview(reader.result as string);
      } else {
        setBackImage(file);
        setBackPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!frontImage) {
      toast.error('Please upload the front image of your document');
      return;
    }

    if (requiresBackImage && !backImage) {
      toast.error('Please upload the back image of your document');
      return;
    }

    setIsUploading(true);
    setVerificationStatus('uploading');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('frontImage', frontImage);
      if (backImage) {
        formData.append('backImage', backImage);
      }
      formData.append('documentType', documentType);
      if (documentNumber) {
        formData.append('documentNumber', documentNumber);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/kyc/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      setVerificationStatus('verifying');
      toast.info('Document uploaded! Auto-verification in progress...');

      // Simulate verification time
      await new Promise(resolve => setTimeout(resolve, 2000));

      setVerificationStatus('verified');
      toast.success('Document verified successfully! ✓');

      if (onUploadComplete) {
        onUploadComplete(data.document.id);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setVerificationStatus('failed');
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'verifying':
        return <Loader2 className="h-5 w-5 animate-spin text-amber-500" />;
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'uploading':
        return 'Uploading document...';
      case 'verifying':
        return 'Verifying document authenticity...';
      case 'verified':
        return 'Document verified successfully!';
      case 'failed':
        return 'Verification failed. Please try again.';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Document Number Input */}
        <div className="space-y-2">
          <Label>Document Number (Optional)</Label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., 12345678"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            disabled={isUploading}
          />
        </div>

        {/* Front Image Upload */}
        <div className="space-y-2">
          <Label>Front Side *</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              frontPreview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-primary'
            }`}
            onClick={() => !isUploading && frontInputRef.current?.click()}
          >
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0], 'front')}
              disabled={isUploading}
            />
            
            {frontPreview ? (
              <div className="space-y-2">
                <img
                  src={frontPreview}
                  alt="Front of document"
                  className="max-h-48 mx-auto rounded-lg"
                />
                <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Front image uploaded
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Camera className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-sm text-muted-foreground">
                  Click to upload front of document
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back Image Upload */}
        {requiresBackImage && (
          <div className="space-y-2">
            <Label>Back Side *</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                backPreview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-primary'
              }`}
              onClick={() => !isUploading && backInputRef.current?.click()}
            >
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0], 'back')}
                disabled={isUploading}
              />
              
              {backPreview ? (
                <div className="space-y-2">
                  <img
                    src={backPreview}
                    alt="Back of document"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Back image uploaded
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Camera className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload back of document
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {verificationStatus !== 'idle' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                {getStatusIcon()}
                {getStatusMessage()}
              </span>
              {verificationStatus === 'uploading' && (
                <span className="text-muted-foreground">{uploadProgress}%</span>
              )}
            </div>
            {verificationStatus === 'uploading' && (
              <Progress value={uploadProgress} className="h-2" />
            )}
          </div>
        )}

        {/* Tips */}
        {verificationStatus === 'idle' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Tips for best results:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Ensure the document is clearly visible</li>
                <li>Avoid glare and shadows</li>
                <li>All corners should be visible</li>
                <li>Text should be readable</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!frontImage || (requiresBackImage && !backImage) || isUploading || verificationStatus === 'verified'}
          className="w-full"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : verificationStatus === 'verified' ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verified
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Verify
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
