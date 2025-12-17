import { useState } from 'react';
import { Car, Clock, Play, CheckCircle, User, Wrench, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import OperatorLayout from '@/components/layout/OperatorLayout';
import { mockJobs, mockVehicles, mockServiceTypes, mockUsers } from '@/data/mockData';
import { toast } from 'sonner';

export default function OperatorDashboard() {
  const [jobs, setJobs] = useState(mockJobs.filter(j => j.operatorId === '2' || !j.operatorId));
  const activeJobs = jobs.filter(j => j.status === 'pending' || j.status === 'in_progress');

  const updateJobStatus = (jobId: string, status: 'in_progress' | 'completed') => {
    setJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, status, completedAt: status === 'completed' ? new Date() : undefined } : j
    ));
    toast.success(status === 'completed' ? 'Job marked as complete!' : 'Job started');
  };

  return (
    <OperatorLayout title="Today's Jobs" subtitle={`${activeJobs.length} jobs assigned to you`}>
      <div className="space-y-4">
        {activeJobs.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending jobs at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          activeJobs.map((job) => {
            const vehicle = mockVehicles.find(v => v.id === job.vehicleId);
            const service = mockServiceTypes.find(s => s.id === job.serviceTypeId);
            const customer = mockUsers.find(u => u.id === job.customerId);
            
            return (
              <Card 
                key={job.id} 
                variant={job.status === 'in_progress' ? 'accent' : 'default'}
                className="overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Job Info */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Car className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {vehicle?.make} {vehicle?.model}
                            </h3>
                            <p className="text-sm text-muted-foreground">{vehicle?.licensePlate}</p>
                          </div>
                        </div>
                        <Badge variant={job.status === 'in_progress' ? 'in-progress' : 'pending'}>
                          {job.status === 'in_progress' ? 'In Progress' : 'Pending'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          <span>{service?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{service?.duration} mins est.</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{customer?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          KES {job.totalAmount.toLocaleString()}
                        </div>
                      </div>

                      {job.notes && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{job.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 p-5 md:border-l border-t md:border-t-0 border-border bg-muted/30">
                      {job.status === 'pending' && (
                        <Button 
                          variant="default" 
                          className="flex-1 md:flex-none"
                          onClick={() => updateJobStatus(job.id, 'in_progress')}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Job
                        </Button>
                      )}
                      {job.status === 'in_progress' && (
                        <Button 
                          variant="success" 
                          className="flex-1 md:flex-none"
                          onClick={() => updateJobStatus(job.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete
                        </Button>
                      )}
                      <Button variant="outline" className="flex-1 md:flex-none">
                        Add Parts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </OperatorLayout>
  );
}
