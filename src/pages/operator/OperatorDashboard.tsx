import { useState, useEffect } from 'react';
import { ClipboardList, Wallet, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OperatorLayout from '@/components/layout/OperatorLayout';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { useAuth } from '@/context/AuthContext';

interface Job {
  id: string;
  vehiclePlate: string;
  vehicleModel: string;
  service: string;
  status: 'pending' | 'in_progress' | 'completed';
  amount: number;
}

export default function OperatorDashboard() {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Simulate loading - in production this would fetch from API
    const timer = setTimeout(() => {
      setJobs([]); // Empty state - no mock data
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <OperatorLayout title="My Jobs" subtitle="Today's assignments">
        <LoadingState message="Loading jobs..." />
      </OperatorLayout>
    );
  }

  const activeJobs = jobs.filter(j => j.status === 'pending' || j.status === 'in_progress');
  const completedToday = jobs.filter(j => j.status === 'completed');

  return (
    <OperatorLayout title="My Jobs" subtitle="Today's assignments">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5">
            <ClipboardList className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold text-foreground">{activeJobs.length}</p>
            <p className="text-sm text-muted-foreground">Active Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <Clock className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold text-foreground">{completedToday.length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <Wallet className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold text-foreground">KES 0</p>
            <p className="text-sm text-muted-foreground">Today's Earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Assigned Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {activeJobs.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No jobs assigned"
              description="You don't have any active jobs at the moment. New assignments will appear here."
            />
          ) : (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div 
                  key={job.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{job.vehicleModel}</p>
                    <p className="text-sm text-muted-foreground">{job.vehiclePlate} • {job.service}</p>
                  </div>
                  <p className="font-semibold text-foreground">KES {job.amount}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </OperatorLayout>
  );
}