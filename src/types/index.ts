export type UserRole = 'admin' | 'operator' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  vin?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: 'wash' | 'repair' | 'maintenance' | 'package';
  loyaltyPoints: number;
}

export interface ServiceJob {
  id: string;
  vehicleId: string;
  customerId: string;
  operatorId?: string;
  serviceTypeId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  partsUsed: { partId: string; quantity: number }[];
  totalAmount: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  minStockLevel: number;
  unitPrice: number;
  category: string;
  supplier?: string;
}

export interface Payment {
  id: string;
  jobId: string;
  customerId: string;
  amount: number;
  method: 'mpesa' | 'x402' | 'cash' | 'card';
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  createdAt: Date;
}

export interface LoyaltyAccount {
  customerId: string;
  points: number;
  totalVisits: number;
  freeServicesEarned: number;
  freeServicesRedeemed: number;
}

export interface LoyaltyConfig {
  enabled: boolean;
  pointsPerService: number;
  freeServiceThreshold: number;
  freeServiceType: string;
}
