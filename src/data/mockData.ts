import { 
  ServiceType, InventoryItem, Vehicle, LoyaltyAccount, User, 
  Garage, MobileProvider, AIDiagnosis, Tip, Job, Transaction
} from '@/types';

export const mockUsers: User[] = [
  { id: '1', name: 'John Kamau', email: 'john@trackwash.co.ke', phone: '+254712345678', role: 'admin', createdAt: new Date() },
  { id: '2', name: 'Mary Wanjiku', email: 'mary@trackwash.co.ke', phone: '+254723456789', role: 'operator', createdAt: new Date() },
  { id: '3', name: 'Peter Ochieng', email: 'peter@gmail.com', phone: '+254734567890', role: 'customer', createdAt: new Date() },
  { id: '4', name: 'Grace Muthoni', email: 'grace@gmail.com', phone: '+254745678901', role: 'customer', createdAt: new Date() },
];

export const mockServiceTypes: ServiceType[] = [
  { id: '1', name: 'Basic Wash', description: 'Exterior wash and dry', price: 300, duration: 20, category: 'wash', loyaltyPoints: 1 },
  { id: '2', name: 'Premium Wash', description: 'Full interior and exterior cleaning', price: 800, duration: 45, category: 'wash', loyaltyPoints: 1 },
  { id: '3', name: 'Full Detailing', description: 'Deep clean interior, exterior polish, wax', price: 1500, duration: 90, category: 'wash', loyaltyPoints: 1 },
  { id: '4', name: 'Interior Only', description: 'Vacuum and wipe interior surfaces', price: 400, duration: 30, category: 'wash', loyaltyPoints: 1 },
  { id: '5', name: 'Express Wash', description: 'Quick exterior rinse', price: 200, duration: 15, category: 'wash', loyaltyPoints: 1 },
  { id: '6', name: 'Wash + Wax Package', description: 'Premium wash with protective wax', price: 1000, duration: 60, category: 'package', loyaltyPoints: 1 },
];

export const mockVehicles: Vehicle[] = [
  { id: '1', customerId: '3', make: 'Toyota', model: 'Corolla', year: 2020, licensePlate: 'KDA 123A', color: 'Silver' },
  { id: '2', customerId: '3', make: 'Honda', model: 'CR-V', year: 2019, licensePlate: 'KCB 456B', color: 'Black' },
  { id: '3', customerId: '4', make: 'Nissan', model: 'X-Trail', year: 2021, licensePlate: 'KDE 789C', color: 'White' },
];

export const mockJobs: Job[] = [
  { id: '1', vehicleId: '1', customerId: '3', operatorId: '2', serviceTypeId: '1', status: 'completed', notes: 'Regular customer', totalAmount: 300, tipAmount: 50, createdAt: new Date(Date.now() - 86400000), completedAt: new Date(Date.now() - 82800000) },
  { id: '2', vehicleId: '2', customerId: '3', operatorId: '2', serviceTypeId: '2', status: 'in_progress', totalAmount: 800, createdAt: new Date() },
  { id: '3', vehicleId: '3', customerId: '4', serviceTypeId: '1', status: 'pending', totalAmount: 300, createdAt: new Date() },
  { id: '4', vehicleId: '1', customerId: '3', operatorId: '2', serviceTypeId: '3', status: 'pending', totalAmount: 1500, createdAt: new Date() },
  { id: '5', vehicleId: '1', customerId: '3', operatorId: '2', serviceTypeId: '1', status: 'completed', totalAmount: 300, tipAmount: 100, createdAt: new Date(Date.now() - 172800000), completedAt: new Date(Date.now() - 169200000) },
  { id: '6', vehicleId: '1', customerId: '3', operatorId: '2', serviceTypeId: '2', status: 'completed', totalAmount: 800, createdAt: new Date(Date.now() - 259200000), completedAt: new Date(Date.now() - 255600000) },
  { id: '7', vehicleId: '2', customerId: '3', operatorId: '2', serviceTypeId: '1', status: 'completed', totalAmount: 300, createdAt: new Date(Date.now() - 345600000), completedAt: new Date(Date.now() - 342000000) },
];

export const mockTransactions: Transaction[] = [
  { id: '1', jobId: '1', amount: 300, paymentMethod: 'mpesa', status: 'completed', reference: 'QKJ78HG5TY', createdAt: new Date(Date.now() - 82800000) },
  { id: '2', jobId: '2', amount: 800, paymentMethod: 'mpesa', status: 'completed', reference: 'PLM45JK8WE', createdAt: new Date(Date.now() - 3600000) },
  { id: '3', jobId: '5', amount: 300, paymentMethod: 'mpesa', status: 'completed', reference: 'RTY23NB7XC', createdAt: new Date(Date.now() - 169200000) },
  { id: '4', jobId: '6', amount: 800, paymentMethod: 'mpesa', status: 'completed', reference: 'KLM89VB2DF', createdAt: new Date(Date.now() - 255600000) },
  { id: '5', jobId: '7', amount: 300, paymentMethod: 'cash', status: 'completed', reference: 'CASH-001', createdAt: new Date(Date.now() - 342000000) },
];

export const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Car Shampoo (5L)', quantity: 12, unit: 'bottles', minStockLevel: 5, costPerUnit: 800 },
  { id: '2', name: 'Microfiber Cloths', quantity: 25, unit: 'pieces', minStockLevel: 10, costPerUnit: 150 },
  { id: '3', name: 'Tire Shine Spray', quantity: 8, unit: 'cans', minStockLevel: 5, costPerUnit: 450 },
  { id: '4', name: 'Interior Cleaner', quantity: 3, unit: 'bottles', minStockLevel: 5, costPerUnit: 600 },
  { id: '5', name: 'Wax Polish', quantity: 6, unit: 'jars', minStockLevel: 3, costPerUnit: 1200 },
  { id: '6', name: 'Glass Cleaner', quantity: 4, unit: 'bottles', minStockLevel: 4, costPerUnit: 350 },
];

export const mockLoyalty: LoyaltyAccount[] = [
  { id: '1', customerId: '3', visits: 7, freeWashesEarned: 0, freeWashesRedeemed: 0 },
  { id: '2', customerId: '4', visits: 9, freeWashesEarned: 0, freeWashesRedeemed: 0 },
];

export const mockTips: Tip[] = [
  { id: '1', jobId: '1', operatorId: '2', customerId: '3', amount: 50, createdAt: new Date(Date.now() - 82800000) },
  { id: '2', jobId: '5', operatorId: '2', customerId: '3', amount: 100, createdAt: new Date(Date.now() - 169200000) },
];

// Garages in Nairobi
export const mockGarages: Garage[] = [
  {
    id: '1',
    name: 'Track Wash CBD',
    address: '123 Moi Avenue, Nairobi CBD',
    phone: '+254712345678',
    distance: 1.2,
    rating: 4.8,
    isOpen: true,
    openHours: '7:00 AM - 6:00 PM',
    services: ['1', '2', '3', '4', '5', '6'],
  },
  {
    id: '2',
    name: 'QuickShine Westlands',
    address: '45 Waiyaki Way, Westlands',
    phone: '+254723456789',
    distance: 2.8,
    rating: 4.5,
    isOpen: true,
    openHours: '8:00 AM - 8:00 PM',
    services: ['1', '2', '4', '5'],
  },
  {
    id: '3',
    name: 'Elite Car Wash',
    address: '78 Lang\'ata Road, Karen',
    phone: '+254734567890',
    distance: 4.5,
    rating: 4.9,
    isOpen: true,
    openHours: '6:00 AM - 10:00 PM',
    services: ['1', '2', '3', '5', '6'],
  },
  {
    id: '4',
    name: 'Budget Wash South C',
    address: '12 Ole Dume Road, South C',
    phone: '+254745678901',
    distance: 3.2,
    rating: 4.2,
    isOpen: false,
    openHours: '7:00 AM - 5:00 PM',
    services: ['1', '2', '5'],
  },
];

// Mobile Providers
export const mockMobileProviders: MobileProvider[] = [
  {
    id: '5',
    name: 'James Mobile Wash',
    phone: '+254756789012',
    serviceArea: ['Nairobi CBD', 'Westlands', 'Kilimani'],
    rating: 4.9,
    isAvailable: true,
    eta: 25,
  },
  {
    id: '6',
    name: 'CleanRide Mobile',
    phone: '+254767890123',
    serviceArea: ['Karen', 'Lang\'ata', 'South C'],
    rating: 4.7,
    isAvailable: true,
    eta: 40,
  },
  {
    id: '7',
    name: 'Express Wash Kenya',
    phone: '+254778901234',
    serviceArea: ['Eastleigh', 'Kasarani', 'Roysambu'],
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
  visitsForFreeWash: 10,
  freeServiceType: 'Basic Wash',
};

// Stats helpers
export const getTodayStats = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const completedJobs = mockJobs.filter(j => j.status === 'completed');
  const todayJobs = mockJobs.filter(j => new Date(j.createdAt) >= today);
  const pendingJobs = mockJobs.filter(j => j.status === 'pending');
  const lowStockItems = mockInventory.filter(i => i.quantity <= i.minStockLevel);
  
  // Calculate total revenue (all completed jobs)
  const totalRevenue = completedJobs.reduce((sum, j) => sum + j.totalAmount, 0);
  const totalTips = mockTips.reduce((sum, t) => sum + t.amount, 0);
  
  return {
    todayRevenue: totalRevenue,
    totalTips,
    carsServiced: completedJobs.length,
    pendingServices: pendingJobs.length,
    lowStockAlerts: lowStockItems.length,
  };
};

// Get nearby garages with filters
export const getNearbyGarages = (filters?: { openNow?: boolean; emergencyOnly?: boolean; serviceId?: string }) => {
  let garages = [...mockGarages];
  
  if (filters?.openNow) {
    garages = garages.filter(g => g.isOpen);
  }
  if (filters?.serviceId) {
    garages = garages.filter(g => g.services.includes(filters.serviceId!));
  }
  
  return garages.sort((a, b) => a.distance - b.distance);
};

// Get available mobile providers
export const getAvailableMobileProviders = () => {
  return mockMobileProviders.filter(p => p.isAvailable).sort((a, b) => (a.eta || 999) - (b.eta || 999));
};

// Get customer loyalty info
export const getCustomerLoyalty = (customerId: string) => {
  const loyalty = mockLoyalty.find(l => l.customerId === customerId);
  if (!loyalty) return null;
  
  const visitsUntilFree = mockLoyaltyConfig.visitsForFreeWash - (loyalty.visits % mockLoyaltyConfig.visitsForFreeWash);
  const nextFreeWashIn = visitsUntilFree === 10 ? 10 : visitsUntilFree;
  
  return {
    ...loyalty,
    nextFreeWashIn,
    progress: ((loyalty.visits % 10) / 10) * 100,
  };
};
