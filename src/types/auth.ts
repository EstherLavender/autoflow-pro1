// Authentication & User Types
export type UserRole = 'admin' | 'operator' | 'customer';
export type UserStatus = 'pending' | 'active' | 'rejected';
export type OnboardingStatus = 'incomplete' | 'complete';

export interface User {
  id: string;
  role: UserRole;
  email?: string;
  phone: string;
  status: UserStatus;
  onboardingStatus: OnboardingStatus;
  createdAt: string;
}

// Profile Types by Role
export interface AdminProfile {
  userId: string;
  fullName: string;
  phone: string;
  nationalId: string;
  numberOfCarWashes: number;
  walletAddress?: string;
  carWashes: CarWashBusiness[];
}

export interface CarWashBusiness {
  id: string;
  name: string;
  location: string;
  address: string;
  services: string[];
}

export interface OperatorProfile {
  userId: string;
  fullName: string;
  phone: string;
  nationalId: string;
  inviteCode?: string;
  assignedCarWashId?: string;
}

export interface CustomerProfile {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  vehicles: CustomerVehicle[];
}

export interface CustomerVehicle {
  id: string;
  numberPlate: string;
  carModel: string;
  color: string;
}

// Combined profile type
export type UserProfile = AdminProfile | OperatorProfile | CustomerProfile;
