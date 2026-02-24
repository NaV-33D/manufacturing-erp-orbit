import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Mock users with different roles
const mockUsers = [
  {
    id: 1,
    name: 'John Admin',
    email: 'admin@paint.com',
    role: 'Super Admin',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      users: { create: true, read: true, update: true, delete: true, approve: true },
      masterData: { create: true, read: true, update: true, delete: true, approve: true },
      bom: { create: true, read: true, update: true, delete: true, approve: true },
      sales: { create: true, read: true, update: true, delete: true, approve: true },
      mrp: { create: true, read: true, update: true, delete: true, approve: true },
      purchase: { create: true, read: true, update: true, delete: true, approve: true },
      grn: { create: true, read: true, update: true, delete: true, approve: true },
      inventory: { create: true, read: true, update: true, delete: true, approve: true },
      workOrder: { create: true, read: true, update: true, delete: true, approve: true },
      qc: { create: true, read: true, update: true, delete: true, approve: true },
      dispatch: { create: true, read: true, update: true, delete: true, approve: true },
      reports: { read: true },
    }
  },
  {
    id: 2,
    name: 'Mike Engineer',
    email: 'engineer@paint.com',
    role: 'Process Engineer',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      masterData: { create: true, read: true, update: true, delete: false, approve: false },
      bom: { create: true, read: true, update: true, delete: false, approve: false },
      reports: { read: true },
    }
  },
  {
    id: 3,
    name: 'Sarah Sales',
    email: 'sales@paint.com',
    role: 'Sales Executive',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      sales: { create: true, read: true, update: true, delete: false, approve: false },
      reports: { read: true },
    }
  },
  {
    id: 4,
    name: 'David Production',
    email: 'production@paint.com',
    role: 'Production Manager',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      mrp: { create: true, read: true, update: true, delete: false, approve: true },
      workOrder: { create: true, read: true, update: true, delete: false, approve: true },
      inventory: { read: true },
      reports: { read: true },
    }
  },
  {
    id: 5,
    name: 'Lisa Purchase',
    email: 'purchase@paint.com',
    role: 'Purchase Officer',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      purchase: { create: true, read: true, update: true, delete: false, approve: false },
      grn: { read: true },
      reports: { read: true },
    }
  },
  {
    id: 6,
    name: 'Tom Store',
    email: 'store@paint.com',
    role: 'Store Manager',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      grn: { create: true, read: true, update: true, delete: false, approve: true },
      inventory: { create: true, read: true, update: true, delete: false, approve: true },
      reports: { read: true },
    }
  },
  {
    id: 7,
    name: 'Emma QC',
    email: 'qc@paint.com',
    role: 'QC Lead',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      qc: { create: true, read: true, update: true, delete: false, approve: true },
      inventory: { read: true },
      reports: { read: true },
    }
  },
  {
    id: 8,
    name: 'Jack Dispatch',
    email: 'dispatch@paint.com',
    role: 'Dispatch Executive',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      dispatch: { create: true, read: true, update: true, delete: false, approve: false },
      inventory: { read: true },
      reports: { read: true },
    }
  },
  {
    id: 9,
    name: 'Bob Operator',
    email: 'operator@paint.com',
    role: 'Machine Operator',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      workOrder: { read: true, update: true },
    }
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(mockUsers[0]); // Default to Super Admin

  const hasPermission = (module, action) => {
    if (!currentUser || !currentUser.permissions[module]) {
      return false;
    }
    return currentUser.permissions[module][action] === true;
  };

  const hasModule = (module) => {
    if (!currentUser || !currentUser.permissions[module]) {
      return false;
    }
    return true;
  };

  const switchUser = (userId) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const value = {
    currentUser,
    mockUsers,
    hasPermission,
    hasModule,
    switchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
