import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

export default function DisputesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Disputes</h1>
        <p className="text-muted-foreground mt-1">Manage customer complaints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Open Disputes</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={AlertTriangle}
            title="No disputes"
            description="There are no open disputes at the moment. Customer complaints will appear here for resolution."
          />
        </CardContent>
      </Card>
    </div>
  );
}