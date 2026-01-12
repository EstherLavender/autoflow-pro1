import { useState, useEffect } from 'react';
import { Home, Building, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomerLayout from '@/components/layout/CustomerLayout';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import MobileProviderCard from '@/components/mobile/MobileProviderCard';
import { supabase } from '@/lib/Supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type WashOption = 'mobile' | 'physical';

export default function WashPage() {
  const navigate = useNavigate();
  const [washOption, setWashOption] = useState<WashOption | null>(null);
  const [mobileProviders, setMobileProviders] = useState<any[]>([]);
  const [garagesCount, setGaragesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [providersRes, garagesRes] = await Promise.all([
        supabase.from('mobile_providers').select('*').eq('is_available', true),
        supabase.from('garages').select('id', { count: 'exact', head: true })
      ]);
      
      if (providersRes.error) throw providersRes.error;
      setMobileProviders(providersRes.data || []);
      setGaragesCount(garagesRes.count || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load wash options');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <CustomerLayout title="Wash My Car" subtitle="Choose how you want your car cleaned">
        <LoadingState message="Loading options..." />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="Wash My Car" subtitle="Choose how you want your car cleaned">
      {!washOption ? (
        <div className="space-y-4">
          <Card variant="interactive" onClick={() => setWashOption('mobile')}>
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Home className="h-7 w-7 text-primary" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Mobile Detailing</h3>
                  <p className="text-sm text-muted-foreground mb-3">We come to you! Get your car washed at home or work.</p>
                  <span className="text-primary font-medium">{mobileProviders.length} detailers available</span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card variant="interactive" onClick={() => setWashOption('physical')}>
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0"><Building className="h-7 w-7 text-accent" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Car Wash Location</h3>
                  <p className="text-sm text-muted-foreground mb-3">Drive to a nearby car wash for quick service.</p>
                  <span className="text-accent font-medium">{garagesCount} locations nearby</span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : washOption === 'mobile' ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setWashOption(null)}>← Back</Button>
          <h3 className="font-semibold">Available Mobile Detailers</h3>
          {mobileProviders.map((provider) => (
            <MobileProviderCard key={provider.id} provider={provider} onSelect={() => navigate(`/customer/book?mobileProviderId=${provider.id}`)} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setWashOption(null)}>← Back</Button>
          <h3 className="font-semibold">Nearby Car Washes</h3>
          <Button variant="default" className="w-full" onClick={() => navigate('/customer/garages')}>View All Locations</Button>
        </div>
      )}
    </CustomerLayout>
  );
}
