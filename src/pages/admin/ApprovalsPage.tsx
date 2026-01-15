import { useState, useEffect } from 'react';
import { Check, X, User, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usersAPI } from '@/lib/api';
import { toast } from 'sonner';

interface PendingUser {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  phone?: string;
}

export default function ApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPendingUsers = async () => {
    try {
      const response = await usersAPI.getPending();
      setPendingUsers(response.data || []);
    } catch (error) {
      console.error('Error loading pending users:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const handleApprove = async (userId: string, name: string) => {
    try {
      await usersAPI.approve(userId);
      toast.success(`${name} has been approved!`);
      loadPendingUsers();
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (userId: string, name: string) => {
    try {
      await usersAPI.reject(userId);
      toast.error(`${name} has been rejected`);
      loadPendingUsers();
    } catch (error) {
      toast.error('Failed to reject user');
    }
  };

  const pendingDetailers = pendingUsers.filter(u => u.role === 'detailer');
  const pendingAdmins = pendingUsers.filter(u => u.role === 'admin');
  const totalPending = pendingUsers.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve pending accounts</p>
      </div>

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
                <p className="text-2xl font-bold">{pendingDetailers.length}</p>
                <p className="text-sm text-muted-foreground">Pending Detailers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated">
        <Tabs defaultValue="detailers">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Accounts</CardTitle>
              <TabsList>
                <TabsTrigger value="detailers">
                  Detailers
                  {pendingDetailers.length > 0 && (
                    <Badge variant="warning" className="ml-2">
                      {pendingDetailers.length}
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
            <TabsContent value="detailers" className="mt-0">
              {pendingDetailers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending detailer approvals</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingDetailers.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          {user.phone && (
                            <p className="text-xs text-muted-foreground">{user.phone}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(user.id, user.full_name || 'User')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(user.id, user.full_name || 'User')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
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
                  {pendingAdmins.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          {user.phone && (
                            <p className="text-xs text-muted-foreground">{user.phone}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(user.id, user.full_name || 'User')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(user.id, user.full_name || 'User')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
