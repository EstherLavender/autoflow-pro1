import { useState, useEffect } from 'react';
import { Check, X, User, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/layout/AdminLayout';
import { getPendingOperators, getPendingAdmins, updateUserStatus } from '@/lib/userStore';
import { User as UserType, OperatorProfile, AdminProfile } from '@/types/auth';
import { toast } from 'sonner';

type PendingUser = UserType & { profile?: OperatorProfile | AdminProfile };

export default function ApprovalsPage() {
  const [pendingOperators, setPendingOperators] = useState<PendingUser[]>([]);
  const [pendingAdmins, setPendingAdmins] = useState<PendingUser[]>([]);

  const loadPendingUsers = () => {
    setPendingOperators(getPendingOperators());
    setPendingAdmins(getPendingAdmins());
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const handleApprove = (userId: string, name: string) => {
    updateUserStatus(userId, 'active');
    toast.success(`${name} has been approved!`);
    loadPendingUsers();
  };

  const handleReject = (userId: string, name: string) => {
    updateUserStatus(userId, 'rejected');
    toast.error(`${name} has been rejected`);
    loadPendingUsers();
  };

  const totalPending = pendingOperators.length + pendingAdmins.length;

  return (
    <AdminLayout 
      title="Approvals" 
      subtitle="Review and approve pending accounts"
    >
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPending}</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingOperators.length}</p>
                <p className="text-sm text-muted-foreground">Pending Detailers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated">
        <Tabs defaultValue="operators">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Accounts</CardTitle>
              <TabsList>
                <TabsTrigger value="operators">
                  Detailers
                  {pendingOperators.length > 0 && (
                    <Badge variant="warning" className="ml-2">
                      {pendingOperators.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="admins">
                  Owners
                  {pendingAdmins.length > 0 && (
                    <Badge variant="warning" className="ml-2">
                      {pendingAdmins.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent>
            <TabsContent value="operators" className="mt-0">
              {pendingOperators.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending detailer approvals</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingOperators.map((user) => {
                    const profile = user.profile as OperatorProfile | undefined;
                    return (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {profile?.fullName || 'Unknown'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {profile?.phone || user.phone}
                            </p>
                            {profile?.inviteCode && (
                              <Badge variant="outline" className="mt-1">
                                Code: {profile.inviteCode}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(user.id, profile?.fullName || 'User')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(user.id, profile?.fullName || 'User')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="admins" className="mt-0">
              {pendingAdmins.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending owner approvals</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingAdmins.map((user) => {
                    const profile = user.profile as AdminProfile | undefined;
                    return (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {profile?.fullName || 'Unknown'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {profile?.phone || user.phone}
                            </p>
                            {profile?.carWashes && (
                              <p className="text-xs text-muted-foreground">
                                {profile.carWashes.length} car wash location(s)
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(user.id, profile?.fullName || 'User')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(user.id, profile?.fullName || 'User')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </AdminLayout>
  );
}
