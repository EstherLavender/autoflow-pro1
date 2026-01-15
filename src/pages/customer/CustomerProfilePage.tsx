import { useState } from 'react';
import { User, Phone, Mail, Car, Star, Shield, Edit2, Save, X, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    defaultVehicle: 'KCA 123A',
    vehicleModel: 'Toyota Camry',
  });

  const [stats] = useState({
    totalWashes: 8,
    loyaltyPoints: 80,
    nextFreeWash: 2, // washes until free
    savedAmount: 1200, // KES saved through loyalty
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In production, this would save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('customerProfile', JSON.stringify(profileData));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setProfileData({
      fullName: user?.full_name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      defaultVehicle: 'KCA 123A',
      vehicleModel: 'Toyota Camry',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {profileData.fullName.charAt(0).toUpperCase() || 'C'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{profileData.fullName || 'Customer'}</h2>
                <p className="text-muted-foreground">Valued Customer</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user?.status === 'active' ? 'success' : 'default'}>
                    {user?.status === 'active' ? 'Active' : user?.status || 'Pending'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">{stats.loyaltyPoints} points</span>
                  </div>
                </div>
              </div>
            </div>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{stats.totalWashes}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Washes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center gap-1">
              <Award className="h-5 w-5 text-accent" />
              <p className="text-3xl font-bold text-foreground">{stats.loyaltyPoints}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Loyalty Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-accent">{stats.nextFreeWash}</p>
            <p className="text-sm text-muted-foreground mt-1">Until Free Wash</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-success">KES {stats.savedAmount}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground">{profileData.fullName || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground">{profileData.phone || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground">{profileData.email || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Default Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehiclePlate">License Plate</Label>
              {isEditing ? (
                <Input
                  id="vehiclePlate"
                  value={profileData.defaultVehicle}
                  onChange={(e) => setProfileData({ ...profileData, defaultVehicle: e.target.value })}
                  placeholder="KCA 123A"
                />
              ) : (
                <p className="text-foreground font-mono">{profileData.defaultVehicle || 'Not set'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Vehicle Model</Label>
              {isEditing ? (
                <Input
                  id="vehicleModel"
                  value={profileData.vehicleModel}
                  onChange={(e) => setProfileData({ ...profileData, vehicleModel: e.target.value })}
                  placeholder="Toyota Camry"
                />
              ) : (
                <p className="text-foreground">{profileData.vehicleModel || 'Not set'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loyalty Program */}
      <Card variant="elevated" className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Loyalty Rewards</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You're only {stats.nextFreeWash} washes away from your next free wash! 
                Keep earning points with every service.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent to-primary transition-all"
                    style={{ width: `${((10 - stats.nextFreeWash) / 10) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground">{10 - stats.nextFreeWash}/10</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
