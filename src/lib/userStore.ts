// Simple localStorage-based user store
// Designed to be easily replaced with API calls later

import { 
  User, 
  UserRole, 
  UserStatus, 
  AdminProfile, 
  OperatorProfile, 
  CustomerProfile,
  UserProfile 
} from '@/types/auth';

const USERS_KEY = 'trackwash_users';
const PROFILES_KEY = 'trackwash_profiles';
const SESSION_KEY = 'trackwash_session';

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get all users
export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

// Save users
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get all profiles
export const getProfiles = (): UserProfile[] => {
  const data = localStorage.getItem(PROFILES_KEY);
  return data ? JSON.parse(data) : [];
};

// Save profiles
const saveProfiles = (profiles: UserProfile[]): void => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

// Find user by email or phone
export const findUser = (identifier: string): User | undefined => {
  const users = getUsers();
  return users.find(u => 
    u.email?.toLowerCase() === identifier.toLowerCase() || 
    u.phone === identifier
  );
};

// Find user by ID
export const findUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.id === id);
};

// Create new user (signup)
export const createUser = (data: {
  role: UserRole;
  email?: string;
  phone: string;
  name?: string;
}): User => {
  const users = getUsers();
  
  // Check if user already exists
  const existing = findUser(data.email || data.phone);
  if (existing) {
    throw new Error('User already exists with this email or phone');
  }

  const newUser: User = {
    id: generateId(),
    role: data.role,
    email: data.email,
    phone: data.phone,
    status: data.role === 'customer' ? 'active' : 'pending',
    onboardingStatus: 'incomplete',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  
  return newUser;
};

// Login user
export const loginUser = (identifier: string, role?: UserRole): User => {
  const user = findUser(identifier);
  
  if (!user) {
    throw new Error('No account found with this email or phone');
  }
  
  if (role && user.role !== role) {
    throw new Error(`This account is registered as a ${user.role}, not ${role}`);
  }
  
  return user;
};

// Update user status
export const updateUserStatus = (userId: string, status: UserStatus): User | undefined => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) return undefined;
  
  users[index].status = status;
  saveUsers(users);
  
  return users[index];
};

// Update user onboarding status
export const updateOnboardingStatus = (userId: string, status: 'incomplete' | 'complete'): User | undefined => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) return undefined;
  
  users[index].onboardingStatus = status;
  saveUsers(users);
  
  return users[index];
};

// Get profile for user
export const getProfile = <T extends UserProfile>(userId: string): T | undefined => {
  const profiles = getProfiles();
  return profiles.find(p => p.userId === userId) as T | undefined;
};

// Save/Update profile
export const saveProfile = (profile: UserProfile): void => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.userId === profile.userId);
  
  if (index === -1) {
    profiles.push(profile);
  } else {
    profiles[index] = profile;
  }
  
  saveProfiles(profiles);
};

// Session management
export const setSession = (user: User): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSession = (): User | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

// Get pending users for approval (admin feature)
export const getPendingUsers = (): User[] => {
  return getUsers().filter(u => u.status === 'pending');
};

// Get pending operators
export const getPendingOperators = (): (User & { profile?: OperatorProfile })[] => {
  const pending = getPendingUsers().filter(u => u.role === 'operator');
  return pending.map(user => ({
    ...user,
    profile: getProfile<OperatorProfile>(user.id),
  }));
};

// Get pending admins
export const getPendingAdmins = (): (User & { profile?: AdminProfile })[] => {
  const pending = getPendingUsers().filter(u => u.role === 'admin');
  return pending.map(user => ({
    ...user,
    profile: getProfile<AdminProfile>(user.id),
  }));
};

// Validate operator invite code (mock implementation)
export const validateInviteCode = (code: string): boolean => {
  // For MVP, accept any 6+ character code
  return code.length >= 6;
};

// Initialize demo data
export const initializeDemoData = (): void => {
  const users = getUsers();
  if (users.length > 0) return; // Already initialized
  
  // Create demo users for testing
  const demoUsers: User[] = [
    {
      id: 'demo-admin-1',
      role: 'admin',
      email: 'admin@trackwash.co.ke',
      phone: '+254700000001',
      status: 'active',
      onboardingStatus: 'complete',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-operator-1',
      role: 'operator',
      email: 'operator@trackwash.co.ke',
      phone: '+254700000002',
      status: 'active',
      onboardingStatus: 'complete',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-customer-1',
      role: 'customer',
      email: 'customer@trackwash.co.ke',
      phone: '+254700000003',
      status: 'active',
      onboardingStatus: 'complete',
      createdAt: new Date().toISOString(),
    },
  ];
  
  saveUsers(demoUsers);
  
  // Create demo profiles
  const demoProfiles: UserProfile[] = [
    {
      userId: 'demo-admin-1',
      fullName: 'John Mwangi',
      phone: '+254700000001',
      nationalId: '12345678',
      numberOfCarWashes: 2,
      carWashes: [
        {
          id: 'cw-1',
          name: 'Track Wash Westlands',
          location: 'Westlands',
          address: 'Waiyaki Way, Westlands, Nairobi',
          services: ['Basic Wash', 'Premium Wash', 'Interior Cleaning'],
        },
        {
          id: 'cw-2',
          name: 'Track Wash CBD',
          location: 'CBD',
          address: 'Kenyatta Avenue, Nairobi',
          services: ['Basic Wash', 'Premium Wash'],
        },
      ],
    } as AdminProfile,
    {
      userId: 'demo-operator-1',
      fullName: 'Peter Ochieng',
      phone: '+254700000002',
      nationalId: '87654321',
      inviteCode: 'TRACK2024',
      assignedCarWashId: 'cw-1',
    } as OperatorProfile,
    {
      userId: 'demo-customer-1',
      fullName: 'Mary Wanjiku',
      phone: '+254700000003',
      email: 'customer@trackwash.co.ke',
      vehicles: [
        {
          id: 'v-1',
          numberPlate: 'KDA 123A',
          carModel: 'Toyota Camry',
          color: 'Silver',
        },
      ],
    } as CustomerProfile,
  ];
  
  saveProfiles(demoProfiles);
};
