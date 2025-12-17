import { Bell, Mail, Smartphone, CheckCircle, Clock, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import CustomerLayout from '@/components/layout/CustomerLayout';
import { mockNotifications } from '@/data/mockData';
import { useState } from 'react';

const stageLabels = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  qc: 'Quality Check',
  ready_for_pickup: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const statusConfig = {
  sent: { icon: Send, variant: 'secondary' as const },
  delivered: { icon: CheckCircle, variant: 'success' as const },
  failed: { icon: Clock, variant: 'destructive' as const },
};

export default function NotificationsPage() {
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  return (
    <CustomerLayout title="Notifications" subtitle="Manage your service update preferences">
      {/* Preferences */}
      <Card variant="elevated" className="mb-6">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via Africa's Talking</p>
              </div>
            </div>
            <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via SendGrid</p>
              </div>
            </div>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockNotifications.map((notif) => {
            const status = statusConfig[notif.status];
            const StatusIcon = status.icon;
            return (
              <div key={notif.id} className="flex items-start gap-4 p-4 rounded-lg border border-border">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  notif.channel === 'sms' ? 'bg-success/10' : 'bg-primary/10'
                }`}>
                  {notif.channel === 'sms' ? (
                    <Smartphone className="h-5 w-5 text-success" />
                  ) : (
                    <Mail className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{stageLabels[notif.stage]}</Badge>
                    <Badge variant={status.variant}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {notif.status}
                    </Badge>
                  </div>
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notif.createdAt.toLocaleString('en-KE')}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </CustomerLayout>
  );
}
