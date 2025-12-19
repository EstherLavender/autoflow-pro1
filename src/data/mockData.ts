import { 
  ServiceType, ServiceJob, InventoryItem, Vehicle, LoyaltyAccount, Payment, User, 
  OffRampTransaction, Invoice, ServiceNotification, Garage, MobileProvider, AIDiagnosis, Tip 
} from '@/types';

export const mockUsers: User[] = [
  { id: '1', name: 'John Kamau', email: 'john@x402.com', phone: '+254712345678', role: 'admin', walletAddress: '0x8f3a...7b2e', createdAt: new Date() },
  { id: '2', name: 'Mary Wanjiku', email: 'mary@x402.com', phone: '+254723456789', role: 'operator', createdAt: new Date() },
  { id: '3', name: 'Peter Ochieng', email: 'peter@gmail.com', phone: '+254734567890', role: 'customer', walletAddress: '0x1234...abcd', createdAt: new Date() },
  { id: '4', name: 'Grace Muthoni', email: 'grace@gmail.com', phone: '+254745678901', role: 'customer', createdAt: new Date() },
  { id: '5', name: 'James Detailer', email: 'james@mobile.com', phone: '+254756789012', role: 'mobile_provider', createdAt: new Date() },
];

export const mockServiceTypes: ServiceType[] = [
  { id: '1', name: 'Basic Wash', description: 'Exterior wash and dry', price: 500, duration: 30, category: 'wash', loyaltyPoints: 1, mobileAvailable: true },
  { id: '2', name: 'Premium Wash', description: 'Full interior and exterior cleaning', price: 1500, duration: 60, category: 'wash', loyaltyPoints: 3, mobileAvailable: true },
  { id: '3', name: 'Oil Change', description: 'Engine oil and filter replacement', price: 3500, duration: 45, category: 'maintenance', loyaltyPoints: 5 },
  { id: '4', name: 'Brake Service', description: 'Brake pad inspection and replacement', price: 8000, duration: 120, category: 'repair', loyaltyPoints: 10 },
  { id: '5', name: 'Tire Rotation', description: 'Rotate and balance all tires', price: 2000, duration: 45, category: 'maintenance', loyaltyPoints: 3 },
  { id: '6', name: 'Full Service Package', description: 'Wash + Oil change + Tire rotation', price: 5500, duration: 150, category: 'package', loyaltyPoints: 12 },
  { id: '7', name: 'Interior Detailing', description: 'Deep clean seats, carpets, and surfaces', price: 3000, duration: 90, category: 'detailing', loyaltyPoints: 5, mobileAvailable: true },
  { id: '8', name: 'Ceramic Coating', description: 'Professional ceramic protection', price: 15000, duration: 240, category: 'detailing', loyaltyPoints: 20, mobileAvailable: true },
  { id: '9', name: 'Express Detailing', description: 'Quick exterior polish and interior wipe', price: 2000, duration: 45, category: 'detailing', loyaltyPoints: 3, mobileAvailable: true },
];

export const mockVehicles: Vehicle[] = [
  { 
    id: '1', customerId: '3', make: 'Toyota', model: 'Corolla', year: 2020, licensePlate: 'KDA 123A', color: 'Silver',
    healthStatus: 'good', lastServiceDate: new Date(Date.now() - 7 * 86400000), nextServiceDue: new Date(Date.now() + 30 * 86400000)
  },
  { 
    id: '2', customerId: '3', make: 'Honda', model: 'CR-V', year: 2019, licensePlate: 'KCB 456B', color: 'Black',
    healthStatus: 'attention', lastServiceDate: new Date(Date.now() - 45 * 86400000), nextServiceDue: new Date(Date.now() + 5 * 86400000)
  },
  { 
    id: '3', customerId: '4', make: 'Nissan', model: 'X-Trail', year: 2021, licensePlate: 'KDE 789C', color: 'White',
    healthStatus: 'good', lastServiceDate: new Date(Date.now() - 14 * 86400000)
  },
];

export const mockJobs: ServiceJob[] = [
  { id: '1', vehicleId: '1', customerId: '3', operatorId: '2', serviceTypeId: '1', status: 'completed', stage: 'completed', notes: 'Regular customer', partsUsed: [], totalAmount: 500, tipAmount: 50, createdAt: new Date(Date.now() - 86400000), completedAt: new Date(Date.now() - 82800000), invoiceUrl: '/invoices/INV-001.pdf' },
  { id: '2', vehicleId: '2', customerId: '3', operatorId: '2', serviceTypeId: '3', status: 'in_progress', stage: 'qc', partsUsed: [{ partId: '1', quantity: 1 }], totalAmount: 3500, createdAt: new Date() },
  { id: '3', vehicleId: '3', customerId: '4', serviceTypeId: '2', status: 'pending', stage: 'scheduled', partsUsed: [], totalAmount: 1500, createdAt: new Date() },
  { id: '4', vehicleId: '1', customerId: '3', operatorId: '2', serviceTypeId: '4', status: 'pending', stage: 'in_progress', partsUsed: [], totalAmount: 8000, createdAt: new Date() },
  { id: '5', vehicleId: '1', customerId: '3', mobileProviderId: '5', serviceTypeId: '7', status: 'completed', stage: 'completed', partsUsed: [], totalAmount: 3000, tipAmount: 200, isMobile: true, location: { lat: -1.2921, lng: 36.8219, address: '123 Moi Avenue, Nairobi' }, createdAt: new Date(Date.now() - 172800000), completedAt: new Date(Date.now() - 169200000) },
];

export const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Engine Oil 5W-30', description: '4L synthetic oil', quantity: 25, minStockLevel: 10, unitPrice: 2500, category: 'Oils', supplier: 'Shell Kenya' },
  { id: '2', name: 'Oil Filter', description: 'Universal fit', quantity: 8, minStockLevel: 15, unitPrice: 800, category: 'Filters', supplier: 'AutoParts Ltd' },
  { id: '3', name: 'Brake Pads (Front)', description: 'Ceramic pads', quantity: 12, minStockLevel: 8, unitPrice: 3500, category: 'Brakes', supplier: 'Brake Masters' },
  { id: '4', name: 'Air Filter', description: 'Standard replacement', quantity: 5, minStockLevel: 10, unitPrice: 1200, category: 'Filters', supplier: 'AutoParts Ltd' },
  { id: '5', name: 'Car Shampoo', description: '5L concentrate', quantity: 3, minStockLevel: 5, unitPrice: 1500, category: 'Cleaning', supplier: 'Clean Pro' },
  { id: '6', name: 'Wax Polish', description: 'Premium carnauba wax', quantity: 7, minStockLevel: 4, unitPrice: 2000, category: 'Cleaning', supplier: 'Clean Pro' },
];

export const mockLoyalty: LoyaltyAccount[] = [
  { customerId: '3', points: 28, totalVisits: 7, freeServicesEarned: 0, freeServicesRedeemed: 0 },
  { customerId: '4', points: 42, totalVisits: 9, freeServicesEarned: 0, freeServicesRedeemed: 0 },
];

export const mockPayments: Payment[] = [
  { id: '1', jobId: '1', customerId: '3', amount: 500, method: 'mpesa', status: 'completed', reference: 'QKJ78HG5TY', createdAt: new Date(Date.now() - 82800000) },
  { id: '2', jobId: '2', customerId: '3', amount: 3500, amountUsd: 27.13, method: 'x402', stablecoin: 'usdc', txHash: '0xabc...def', status: 'completed', createdAt: new Date(Date.now() - 3600000) },
  { id: '3', jobId: '4', customerId: '3', amount: 8000, method: 'x402', status: 'pending', createdAt: new Date() },
];

export const mockTips: Tip[] = [
  { id: '1', jobId: '1', recipientId: '2', recipientType: 'operator', amount: 50, method: 'mpesa', status: 'completed', createdAt: new Date(Date.now() - 82800000) },
  { id: '2', jobId: '5', recipientId: '5', recipientType: 'mobile_provider', amount: 200, method: 'mpesa', status: 'completed', createdAt: new Date(Date.now() - 169200000) },
];

export const mockOffRampTransactions: OffRampTransaction[] = [
  { id: '1', amount: 100, stablecoin: 'usdc', targetCurrency: 'KES', targetAmount: 12900, status: 'completed', rainTxId: 'RAIN-001', createdAt: new Date(Date.now() - 86400000) },
  { id: '2', amount: 50, stablecoin: 'usdt', targetCurrency: 'KES', targetAmount: 6450, status: 'processing', rainTxId: 'RAIN-002', createdAt: new Date() },
];

export const mockInvoices: Invoice[] = [
  { id: '1', jobId: '1', customerId: '3', amount: 500, paymentMethod: 'M-Pesa', items: [{ name: 'Basic Wash', price: 500, quantity: 1 }], url: '/invoices/INV-001.pdf', createdAt: new Date(Date.now() - 82800000) },
  { id: '2', jobId: '2', customerId: '3', amount: 3500, amountUsd: 27.13, paymentMethod: 'USDC (X402)', items: [{ name: 'Oil Change', price: 3500, quantity: 1 }], url: '/invoices/INV-002.pdf', createdAt: new Date(Date.now() - 3600000) },
];

export const mockNotifications: ServiceNotification[] = [
  { id: '1', jobId: '2', customerId: '3', stage: 'in_progress', message: 'Your car service has started!', channel: 'sms', status: 'delivered', createdAt: new Date(Date.now() - 7200000) },
  { id: '2', jobId: '2', customerId: '3', stage: 'qc', message: 'Your car is now in quality check.', channel: 'sms', status: 'delivered', createdAt: new Date(Date.now() - 3600000) },
  { id: '3', jobId: '2', customerId: '3', stage: 'qc', message: 'Your car is now in quality check.', channel: 'email', status: 'sent', createdAt: new Date(Date.now() - 3600000) },
];

// Garages
export const mockGarages: Garage[] = [
  {
    id: '1',
    name: 'Luftreiber Auto Care',
    address: '123 Moi Avenue, Nairobi CBD',
    phone: '+254712345678',
    email: 'info@luftreiber.co.ke',
    location: { lat: -1.2864, lng: 36.8172 },
    operatingHours: { open: '07:00', close: '18:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
    services: ['1', '2', '3', '4', '5', '6'],
    rating: 4.8,
    reviewCount: 156,
    isOpen: true,
    emergencyCapable: true,
    distance: 1.2,
  },
  {
    id: '2',
    name: 'QuickFix Garage',
    address: '45 Kenyatta Road, Westlands',
    phone: '+254723456789',
    location: { lat: -1.2657, lng: 36.8035 },
    operatingHours: { open: '08:00', close: '20:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    services: ['1', '2', '3', '5'],
    rating: 4.5,
    reviewCount: 89,
    isOpen: true,
    emergencyCapable: false,
    distance: 2.8,
  },
  {
    id: '3',
    name: 'Elite Auto Workshop',
    address: '78 Industrial Area, Nairobi',
    phone: '+254734567890',
    location: { lat: -1.3089, lng: 36.8472 },
    operatingHours: { open: '06:00', close: '22:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    services: ['3', '4', '5', '6'],
    rating: 4.9,
    reviewCount: 234,
    isOpen: true,
    emergencyCapable: true,
    distance: 4.5,
  },
  {
    id: '4',
    name: 'Budget Car Wash',
    address: '12 Uhuru Highway, South C',
    phone: '+254745678901',
    location: { lat: -1.3156, lng: 36.8267 },
    operatingHours: { open: '07:00', close: '17:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    services: ['1', '2'],
    rating: 4.2,
    reviewCount: 67,
    isOpen: false,
    emergencyCapable: false,
    distance: 3.2,
  },
];

// Mobile Providers
export const mockMobileProviders: MobileProvider[] = [
  {
    id: '5',
    name: 'James Detailer',
    phone: '+254756789012',
    avatar: undefined,
    serviceArea: ['Nairobi CBD', 'Westlands', 'Kilimani'],
    services: ['1', '2', '7', '8', '9'],
    rating: 4.9,
    isAvailable: true,
    eta: 25,
  },
  {
    id: '6',
    name: 'CleanRide Mobile',
    phone: '+254767890123',
    serviceArea: ['Karen', 'Langata', 'South C'],
    services: ['1', '2', '7', '9'],
    rating: 4.7,
    isAvailable: true,
    eta: 40,
  },
  {
    id: '7',
    name: 'Express Wash Kenya',
    phone: '+254778901234',
    serviceArea: ['Eastleigh', 'Kasarani', 'Roysambu'],
    services: ['1', '2', '9'],
    rating: 4.4,
    isAvailable: false,
    eta: undefined,
  },
];

// AI Diagnoses
export const mockDiagnoses: AIDiagnosis[] = [
  {
    id: '1',
    vehicleId: '2',
    customerId: '3',
    description: 'Squeaking noise when braking',
    category: 'brakes',
    urgency: 'medium',
    explanation: 'The sound you described is commonly associated with worn brake pads. When pads wear down, a metal indicator contacts the rotor, creating a squeaking sound as a warning.',
    recommendation: 'schedule_service',
    recommendedServices: ['4'],
    createdAt: new Date(Date.now() - 172800000),
  },
];

export const mockLoyaltyConfig = {
  enabled: true,
  pointsPerService: 1,
  freeServiceThreshold: 10,
  freeServiceType: 'Basic Wash',
};

// Exchange rates (mock Chainlink price feed data)
export const exchangeRates = {
  usdToKes: 129.00,
  usdcToUsd: 1.0001,
  usdtToUsd: 0.9998,
};

export const convertKesToUsd = (kes: number): number => {
  return Number((kes / exchangeRates.usdToKes).toFixed(2));
};

export const convertUsdToKes = (usd: number): number => {
  return Number((usd * exchangeRates.usdToKes).toFixed(2));
};

// Stats helpers
export const getTodayStats = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayJobs = mockJobs.filter(j => new Date(j.createdAt) >= today);
  const completedToday = todayJobs.filter(j => j.status === 'completed');
  const pendingJobs = mockJobs.filter(j => j.status === 'pending');
  const lowStockItems = mockInventory.filter(i => i.quantity <= i.minStockLevel);
  
  return {
    todayRevenue: completedToday.reduce((sum, j) => sum + j.totalAmount, 0),
    carsServiced: completedToday.length,
    pendingServices: pendingJobs.length,
    lowStockAlerts: lowStockItems.length,
  };
};

// Wallet stats for admin
export const getWalletStats = () => {
  const x402Payments = mockPayments.filter(p => p.method === 'x402' && p.status === 'completed');
  const totalUsdc = x402Payments.filter(p => p.stablecoin === 'usdc').reduce((sum, p) => sum + (p.amountUsd || 0), 0);
  const totalUsdt = x402Payments.filter(p => p.stablecoin === 'usdt').reduce((sum, p) => sum + (p.amountUsd || 0), 0);
  
  return {
    totalUsdc,
    totalUsdt,
    totalUsd: totalUsdc + totalUsdt,
    pendingOffRamp: mockOffRampTransactions.filter(t => t.status === 'pending' || t.status === 'processing').reduce((sum, t) => sum + t.amount, 0),
  };
};

// Get nearby garages with filters
export const getNearbyGarages = (filters?: { openNow?: boolean; emergencyOnly?: boolean; serviceId?: string }) => {
  let garages = [...mockGarages];
  
  if (filters?.openNow) {
    garages = garages.filter(g => g.isOpen);
  }
  if (filters?.emergencyOnly) {
    garages = garages.filter(g => g.emergencyCapable);
  }
  if (filters?.serviceId) {
    garages = garages.filter(g => g.services.includes(filters.serviceId!));
  }
  
  return garages.sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

// Get available mobile providers
export const getAvailableMobileProviders = (serviceId?: string) => {
  let providers = mockMobileProviders.filter(p => p.isAvailable);
  
  if (serviceId) {
    providers = providers.filter(p => p.services.includes(serviceId));
  }
  
  return providers.sort((a, b) => (a.eta || 999) - (b.eta || 999));
};
