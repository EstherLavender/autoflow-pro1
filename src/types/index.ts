export type UserRole = 'admin' | 'operator' | 'customer';

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

export type ServiceStage = 'scheduled' | 'in_progress' | 'qc' | 'ready_for_pickup' | 'completed' | 'cancelled';

export interface ServiceJob {
  id: string;
  vehicleId: string;
  customerId: string;
  operatorId?: string;
  serviceTypeId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  stage: ServiceStage;
  notes?: string;
  partsUsed: { partId: string; quantity: number }[];
  totalAmount: number;
  createdAt: Date;
  completedAt?: Date;
  invoiceUrl?: string;
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
