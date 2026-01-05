// User types - simplified for MVP
export type UserRole = 'admin' | 'operator' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
}

// Vehicle types
export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
}

// Service types
export type ServiceCategory = 'wash' | 'repair' | 'maintenance' | 'package';

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number; // in KES
  duration: number; // in minutes
  category: ServiceCategory;
  loyaltyPoints: number;
}

// Job types
export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Job {
  id: string;
  vehicleId: string;
  customerId: string;
  operatorId?: string;
  serviceTypeId: string;
  status: JobStatus;
  notes?: string;
  totalAmount: number;
  tipAmount?: number;
  createdAt: Date;
  completedAt?: Date;
}

// Transaction types - M-Pesa only for MVP
export type PaymentMethod = 'mpesa' | 'cash';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  jobId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  createdAt: Date;
}

// Loyalty types - 10th wash free
export interface LoyaltyAccount {
  id: string;
  customerId: string;
  visits: number; // total washes
  freeWashesEarned: number;
  freeWashesRedeemed: number;
}

// Inventory types
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  costPerUnit: number;
}

// Garage/Location types
export interface Garage {
  id: string;
  name: string;
  address: string;
  distance: number; // in km
  rating: number;
  isOpen: boolean;
  openHours: string;
  services: string[];
  phone: string;
}

// Tip types
export interface Tip {
  id: string;
  jobId: string;
  operatorId: string;
  customerId: string;
  amount: number; // in KES
  createdAt: Date;
}

// Mobile Provider (for mobile detailing)
export interface MobileProvider {
  id: string;
  name: string;
  phone: string;
  rating: number;
  isAvailable: boolean;
  eta?: number; // minutes
  serviceArea: string[];
}

// AI Diagnosis (for sound feature)
export type DiagnosisCategory = 'belt' | 'engine' | 'exhaust' | 'suspension' | 'brakes' | 'transmission' | 'electrical' | 'unknown';

export interface AIDiagnosis {
  id: string;
  vehicleId: string;
  customerId: string;
  description?: string;
  category: DiagnosisCategory;
  urgency: 'low' | 'medium' | 'high';
  explanation: string;
  recommendation: 'continue_driving' | 'schedule_service' | 'visit_garage' | 'immediate_attention';
  recommendedServices?: string[];
  createdAt: Date;
}
