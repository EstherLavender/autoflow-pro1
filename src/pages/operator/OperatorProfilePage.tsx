import { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Star, Shield, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function OperatorProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    emergencyContact: '',
    emergencyPhone: '',
    yearsOfExperience: '',
    specialties: ['Exterior Wash', 'Interior Detailing'],
  });

  const [stats] = useState({
    rating: 4.8,
    totalJobs: 0,
    completionRate: 100,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In production, this would save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('operatorProfile', JSON.stringify(profileData));
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
      emergencyContact: '',
      emergencyPhone: '',
      yearsOfExperience: '',
      specialties: ['Exterior Wash', 'Interior Detailing'],
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {profileData.fullName.charAt(0).toUpperCase() || 'O'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{profileData.fullName || 'Operator'}</h2>
                <p className="text-muted-foreground">Professional Detailer</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user?.status === 'active' ? 'success' : 'default'}>
                    {user?.status === 'active' ? 'Active' : user?.status || 'Pending'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">{stats.rating}</span>
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
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{stats.totalJobs}</p>
            <p className="text-sm text-muted-foreground mt-1">Jobs Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <p className="text-3xl font-bold text-foreground">{stats.rating}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{stats.completionRate}%</p>
            <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
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

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="experience"
                    type="number"
                    value={profileData.yearsOfExperience}
                    onChange={(e) => setProfileData({ ...profileData, yearsOfExperience: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground">{profileData.yearsOfExperience || 'Not set'} years</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contact Name</Label>
              {isEditing ? (
                <Input
                  id="emergencyContact"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                  placeholder="John Doe"
                />
              ) : (
                <p className="text-foreground">{profileData.emergencyContact || 'Not set'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Contact Phone</Label>
              {isEditing ? (
                <Input
                  id="emergencyPhone"
                  value={profileData.emergencyPhone}
                  onChange={(e) => setProfileData({ ...profileData, emergencyPhone: e.target.value })}
                  placeholder="+254 712 345 678"
                />
              ) : (
                <p className="text-foreground">{profileData.emergencyPhone || 'Not set'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Specialties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profileData.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
