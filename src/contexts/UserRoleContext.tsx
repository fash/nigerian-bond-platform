"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 
  | 'individual'
  | 'family-office'
  | 'institutional'
  | 'stockbroker'
  | 'fund-company'
  | 'sec'
  | 'cbn'
  | 'firs'
  | 'cscs';

interface RoleConfig {
  name: string;
  description: string;
  canTrade: boolean;
  canViewAll: boolean;
  isRegulator: boolean;
  features: string[];
}


interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  roleConfig: RoleConfig;
  availableRoles: UserRole[];
}

const roleConfigs: Record<UserRole, RoleConfig> = {
  individual: {
    name: 'Individual Investor',
    description: 'Personal investment account',
    canTrade: true,
    canViewAll: false,
    isRegulator: false,
    features: ['dashboard', 'buy-bonds', 'p2p-exchange', 'boost-earnings', 'tax-center', 'account'],
  },
  'family-office': {
    name: 'Family Office',
    description: 'Multi-generational wealth management',
    canTrade: true,
    canViewAll: false,
    isRegulator: false,
    features: ['dashboard', 'buy-bonds', 'p2p-exchange', 'boost-earnings', 'tax-center', 'account', 'family-portfolio', 'reporting'],
  },
  institutional: {
    name: 'Institutional Investor',
    description: 'Corporate investment account',
    canTrade: true,
    canViewAll: false,
    isRegulator: false,
    features: ['dashboard', 'buy-bonds', 'p2p-exchange', 'boost-earnings', 'tax-center', 'account', 'bulk-trading', 'api-access'],
  },
  stockbroker: {
    name: 'Licensed Stockbroker',
    description: 'Broker-dealer account',
    canTrade: true,
    canViewAll: false,
    isRegulator: false,
    features: ['dashboard', 'buy-bonds', 'p2p-exchange', 'account', 'client-management', 'trading-desk', 'commission-tracker'],
  },
  'fund-company': {
    name: 'Fund/Asset Manager',
    description: 'Investment fund account',
    canTrade: true,
    canViewAll: false,
    isRegulator: false,
    features: ['dashboard', 'buy-bonds', 'p2p-exchange', 'boost-earnings', 'tax-center', 'account', 'fund-management', 'aum-tracking'],
  },
  sec: {
    name: 'SEC Nigeria',
    description: 'Securities & Exchange Commission',
    canTrade: false,
    canViewAll: true,
    isRegulator: true,
    features: ['regulatory-dashboard', 'market-oversight', 'compliance-monitoring', 'reports', 'account'],
  },
  cbn: {
    name: 'Central Bank of Nigeria',
    description: 'Monetary authority oversight',
    canTrade: false,
    canViewAll: true,
    isRegulator: true,
    features: ['regulatory-dashboard', 'market-data', 'liquidity-monitoring', 'reports', 'account'],
  },
  firs: {
    name: 'FIRS',
    description: 'Federal Inland Revenue Service',
    canTrade: false,
    canViewAll: true,
    isRegulator: true,
    features: ['regulatory-dashboard', 'tax-compliance', 'reporting', 'account'],
  },
  cscs: {
    name: 'CSCS',
    description: 'Central Securities Clearing System',
    canTrade: false,
    canViewAll: true,
    isRegulator: true,
    features: ['view-only-dashboard', 'settlement-tracking', 'reports', 'account'],
  },
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('individual');

  const roleConfig = roleConfigs[role];
  // Fixed: Computed available roles to pass down
  const availableRoles = Object.keys(roleConfigs) as UserRole[];

  return (
    <UserRoleContext.Provider value={{ role, setRole, roleConfig, availableRoles }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}

export { roleConfigs };