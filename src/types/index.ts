export type UserRole = 'admin' | 'operator' | 'customer' | 'garage_partner' | 'mobile_provider';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  walletAddress?: string;
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
  healthStatus?: 'good' | 'attention' | 'urgent';
  lastServiceDate?: Date;
  nextServiceDue?: Date;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: 'wash' | 'repair' | 'maintenance' | 'package' | 'detailing';
  loyaltyPoints: number;
  mobileAvailable?: boolean;
}

export type ServiceStage = 'scheduled' | 'in_progress' | 'qc' | 'ready_for_pickup' | 'completed' | 'cancelled';

export interface ServiceJob {
  id: string;
  vehicleId: string;
  customerId: string;
  operatorId?: string;
  garageId?: string;
  mobileProviderId?: string;
  serviceTypeId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  stage: ServiceStage;
  notes?: string;
  partsUsed: { partId: string; quantity: number }[];
  totalAmount: number;
  tipAmount?: number;
  createdAt: Date;
  completedAt?: Date;
  invoiceUrl?: string;
  location?: { lat: number; lng: number; address: string };
  isMobile?: boolean;
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

export type StablecoinType = 'usdc' | 'usdt';

export interface Payment {
  id: string;
  jobId: string;
  customerId: string;
  amount: number;
  method: 'mpesa' | 'x402' | 'cash' | 'card';
  stablecoin?: StablecoinType;
  amountUsd?: number;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  createdAt: Date;
}

export interface Tip {
  id: string;
  jobId: string;
  recipientId: string;
  recipientType: 'operator' | 'mobile_provider';
  amount: number;
  method: 'mpesa' | 'x402';
  stablecoin?: StablecoinType;
  status: 'pending' | 'completed';
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

export interface OffRampTransaction {
  id: string;
  amount: number;
  stablecoin: StablecoinType;
  targetCurrency: 'KES' | 'USD';
  targetAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  rainTxId?: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  jobId: string;
  customerId: string;
  amount: number;
  amountUsd?: number;
  paymentMethod: string;
  items: { name: string; price: number; quantity: number }[];
  url?: string;
  createdAt: Date;
}

export interface NotificationPreferences {
  smsEnabled: boolean;
  emailEnabled: boolean;
  phone: string;
  email: string;
}

export interface ServiceNotification {
  id: string;
  jobId: string;
  customerId: string;
  stage: ServiceStage;
  message: string;
  channel: 'sms' | 'email';
  status: 'sent' | 'delivered' | 'failed';
  createdAt: Date;
}

// Garage Partner Types
export interface Garage {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  location: { lat: number; lng: number };
  operatingHours: { open: string; close: string; days: string[] };
  services: string[];
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  emergencyCapable: boolean;
  images?: string[];
  distance?: number;
}

// Mobile Service Provider Types
export interface MobileProvider {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  serviceArea: string[];
  services: string[];
  rating: number;
  isAvailable: boolean;
  currentLocation?: { lat: number; lng: number };
  eta?: number;
}

// AI Diagnostics Types
export type DiagnosisUrgency = 'low' | 'medium' | 'high' | 'critical';
export type DiagnosisCategory = 'belt' | 'engine' | 'exhaust' | 'suspension' | 'brakes' | 'transmission' | 'electrical' | 'unknown';

export interface AIDiagnosis {
  id: string;
  vehicleId: string;
  customerId: string;
  audioUrl?: string;
  description?: string;
  category: DiagnosisCategory;
  urgency: DiagnosisUrgency;
  explanation: string;
  recommendation: 'continue_driving' | 'schedule_service' | 'visit_garage' | 'immediate_attention';
  recommendedServices?: string[];
  createdAt: Date;
}

// Rescue / Mobile Mechanic Types (Foundation)
export interface RescueRequest {
  id: string;
  customerId: string;
  vehicleId: string;
  location: { lat: number; lng: number; address: string };
  issue: string;
  status: 'pending' | 'accepted' | 'en_route' | 'arrived' | 'completed' | 'cancelled';
  assignedMechanicId?: string;
  eta?: number;
  createdAt: Date;
}
