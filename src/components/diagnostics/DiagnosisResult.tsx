import { AlertTriangle, CheckCircle, Clock, Wrench, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIDiagnosis } from '@/types';
import { mockServiceTypes } from '@/data/mockData';

interface DiagnosisResultProps {
  diagnosis: AIDiagnosis;
  onFindGarage: () => void;
  onScheduleService: () => void;
}

const urgencyConfig = {
  low: { color: 'success', label: 'Low Priority', icon: CheckCircle },
  medium: { color: 'warning', label: 'Moderate', icon: Clock },
  high: { color: 'destructive', label: 'High Priority', icon: AlertTriangle },
  critical: { color: 'destructive', label: 'Critical', icon: AlertTriangle },
} as const;

const recommendationConfig = {
  continue_driving: {
    title: 'Safe to Continue',
    description: 'You can continue driving, but schedule a check-up soon.',
    action: 'Schedule Service',
    icon: CheckCircle,
  },
  schedule_service: {
    title: 'Schedule Service',
    description: 'Book a service appointment within the next few days.',
    action: 'Book Now',
    icon: Clock,
  },
  visit_garage: {
    title: 'Visit a Garage',
    description: 'We recommend visiting a garage as soon as possible.',
    action: 'Find Nearby Garage',
    icon: MapPin,
  },
  immediate_attention: {
    title: 'Immediate Attention Needed',
    description: 'Do not drive. Get help immediately.',
    action: 'Get Help Now',
    icon: AlertTriangle,
  },
};

const categoryLabels: Record<string, string> = {
  belt: 'Belt/Pulley System',
  engine: 'Engine Issue',
  exhaust: 'Exhaust System',
  suspension: 'Suspension',
  brakes: 'Brake System',
  transmission: 'Transmission',
  electrical: 'Electrical',
  unknown: 'Needs Inspection',
};

export default function DiagnosisResult({ diagnosis, onFindGarage, onScheduleService }: DiagnosisResultProps) {
  const urgency = urgencyConfig[diagnosis.urgency];
  const recommendation = recommendationConfig[diagnosis.recommendation];
  const UrgencyIcon = urgency.icon;
  const RecommendationIcon = recommendation.icon;

  const recommendedServices = diagnosis.recommendedServices
    ?.map(id => mockServiceTypes.find(s => s.id === id))
    .filter(Boolean);

  const handleAction = () => {
    if (diagnosis.recommendation === 'visit_garage' || diagnosis.recommendation === 'immediate_attention') {
      onFindGarage();
    } else {
      onScheduleService();
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Result Card */}
      <Card variant="elevated" className="overflow-hidden">
        <div className={`p-4 ${
          diagnosis.urgency === 'critical' || diagnosis.urgency === 'high' 
            ? 'bg-destructive/10' 
            : diagnosis.urgency === 'medium' 
              ? 'bg-warning/10' 
              : 'bg-success/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              diagnosis.urgency === 'critical' || diagnosis.urgency === 'high'
                ? 'bg-destructive/20'
                : diagnosis.urgency === 'medium'
                  ? 'bg-warning/20'
                  : 'bg-success/20'
            }`}>
              <UrgencyIcon className={`h-6 w-6 ${
                diagnosis.urgency === 'critical' || diagnosis.urgency === 'high'
                  ? 'text-destructive'
                  : diagnosis.urgency === 'medium'
                    ? 'text-warning'
                    : 'text-success'
              }`} />
            </div>
            <div>
              <p className="font-semibold">{categoryLabels[diagnosis.category]}</p>
              <Badge variant={urgency.color as any} className="mt-1">
                {urgency.label}
              </Badge>
            </div>
          </div>
        </div>
        
        <CardContent className="pt-4">
          <div className="space-y-4">
            {/* Explanation */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">What we found</h4>
              <p className="text-sm leading-relaxed">{diagnosis.explanation}</p>
            </div>

            {/* Recommendation */}
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-start gap-3">
                <RecommendationIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">{recommendation.title}</p>
                  <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                </div>
              </div>
            </div>

            {/* Recommended Services */}
            {recommendedServices && recommendedServices.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Suggested Services</h4>
                <div className="space-y-2">
                  {recommendedServices.map(service => (
                    <div key={service!.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{service!.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        KES {service!.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Button variant="hero" size="lg" className="w-full" onClick={handleAction}>
        {recommendation.action}
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>

      {/* Disclaimer */}
      <p className="text-xs text-center text-muted-foreground">
        This is an AI-powered preliminary assessment. A professional mechanic should confirm 
        any diagnosis before repairs are made.
      </p>
    </div>
  );
}
