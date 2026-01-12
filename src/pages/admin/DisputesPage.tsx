import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/layout/AdminLayout';
import { EmptyState } from '@/components/ui/empty-state';

export default function DisputesPage() {
  return (
    <AdminLayout title="Disputes" subtitle="Manage customer complaints">
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
    </AdminLayout>
  );
}