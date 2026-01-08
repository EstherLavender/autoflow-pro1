import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, UserProfile } from '@/types/auth';
import * as userStore from '@/lib/userStore';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (data: { role: UserRole; email?: string; phone: string; name?: string }) => Promise<User>;
  login: (identifier: string, role?: UserRole) => Promise<User>;
  logout: () => void;
  refreshUser: () => void;
  updateProfile: (profile: UserProfile) => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize on mount
  useEffect(() => {
    userStore.initializeDemoData();
    const session = userStore.getSession();
    if (session) {
      // Refresh user data from store
      const freshUser = userStore.findUserById(session.id);
      if (freshUser) {
        setUser(freshUser);
        const userProfile = userStore.getProfile(freshUser.id);
        setProfile(userProfile || null);
      }
    }
    setIsLoading(false);
  }, []);

  const signup = async (data: { role: UserRole; email?: string; phone: string; name?: string }): Promise<User> => {
    const newUser = userStore.createUser(data);
    userStore.setSession(newUser);
    setUser(newUser);
    setProfile(null);
    return newUser;
  };

  const login = async (identifier: string, role?: UserRole): Promise<User> => {
    const loggedInUser = userStore.loginUser(identifier, role);
    userStore.setSession(loggedInUser);
    setUser(loggedInUser);
    
    const userProfile = userStore.getProfile(loggedInUser.id);
    setProfile(userProfile || null);
    
    return loggedInUser;
  };

  const logout = () => {
    userStore.clearSession();
    setUser(null);
    setProfile(null);
  };

  const refreshUser = () => {
    if (user) {
      const freshUser = userStore.findUserById(user.id);
      if (freshUser) {
        setUser(freshUser);
        userStore.setSession(freshUser);
      }
      const userProfile = userStore.getProfile(user.id);
      setProfile(userProfile || null);
    }
  };

  const updateProfile = (newProfile: UserProfile) => {
    userStore.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const completeOnboarding = () => {
    if (user) {
      const updated = userStore.updateOnboardingStatus(user.id, 'complete');
      if (updated) {
        setUser(updated);
        userStore.setSession(updated);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      isAuthenticated: !!user,
      isLoading,
      signup,
      login, 
      logout,
      refreshUser,
      updateProfile,
      completeOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
