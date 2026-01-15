import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { bookingsAPI } from '@/lib/api';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  service_name: string;
  status: string;
  created_at: string;
  notes?: string;
}

export default function DisputesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [disputes, setDisputes] = useState<Booking[]>([]);

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      const response = await bookingsAPI.getAll();
      const allBookings = response.data.bookings || [];
      const disputedBookings = allBookings.filter((b: Booking) => b.status === 'disputed');
      setDisputes(disputedBookings);
    } catch (error) {
      console.error('Error loading disputes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading disputes..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Disputes</h1>
        <p className="text-muted-foreground mt-1">Manage customer complaints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Open Disputes ({disputes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {disputes.length === 0 ? (
            <EmptyState
              icon={AlertTriangle}
              title="No disputes"
              description="There are no open disputes at the moment. Customer complaints will appear here for resolution."
            />
          ) : (
            <div className="space-y-3">
              {disputes.map((dispute) => (
                <div 
                  key={dispute.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <p className="font-medium text-foreground">{dispute.service_name}</p>
                      <Badge variant="destructive">Disputed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer: {dispute.customer_name || dispute.customer_email}
                    </p>
                    {dispute.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Issue: {dispute.notes}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(dispute.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}