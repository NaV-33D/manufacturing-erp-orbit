import { createContext, useContext, useEffect, useState } from 'react';
import { fetchProfile, loginUser } from '../apis/login';

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
  },
  {
    id: 10,
    name: 'Nina Planner',
    email: 'planner@paint.com',
    role: 'Planning Specialist',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      sales: { read: true },
      mrp: { create: true, read: true, update: true, approve: false },
      inventory: { read: true },
      reports: { read: true },
    }
  },
  {
    id: 11,
    name: 'Ravi Maintenance',
    email: 'maintenance@paint.com',
    role: 'Maintenance Lead',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      workOrder: { read: true, update: true },
      inventory: { read: true },
      reports: { read: true },
    }
  },
  {
    id: 12,
    name: 'Priya Finance',
    email: 'finance@paint.com',
    role: 'Finance Analyst',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      purchase: { read: true },
      reports: { read: true },
    }
  },
  {
    id: 13,
    name: 'Karan Warehouse',
    email: 'warehouse@paint.com',
    role: 'Warehouse Clerk',
    avatar: null,
    permissions: {
      dashboard: { read: true },
      grn: { create: true, read: true, update: true, approve: false },
      inventory: { read: true, update: true },
      dispatch: { read: true },
      reports: { read: true },
    }
  }
];

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('erpAuthToken'));
  const [currentUser, setCurrentUser] = useState(() => {
    const savedApiUser = localStorage.getItem('erpCurrentUser');
    if (savedApiUser) {
      try {
        return JSON.parse(savedApiUser);
      } catch (_error) {
        localStorage.removeItem('erpCurrentUser');
      }
    }

    const savedUserId = Number(localStorage.getItem('demoCurrentUserId'));
    if (!Number.isNaN(savedUserId) && savedUserId > 0) {
      const savedUser = mockUsers.find((user) => user.id === savedUserId);
      if (savedUser) {
        return savedUser;
      }
    }
    return mockUsers[0];
  });

  useEffect(() => {
    if (currentUser?.isApiUser) {
      localStorage.setItem('erpCurrentUser', JSON.stringify(currentUser));
      return;
    }

    if (currentUser?.id) {
      localStorage.setItem('demoCurrentUserId', String(currentUser.id));
    }
  }, [currentUser]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('erpAuthToken', authToken);
    } else {
      localStorage.removeItem('erpAuthToken');
    }
  }, [authToken]);

  useEffect(() => {
    const hydrateProfile = async () => {
      if (!authToken || currentUser?.isApiUser) {
        return;
      }

      try {
        const profileResponse = await fetchProfile(authToken);
        if (profileResponse?.data) {
          setCurrentUser(normalizeUser(profileResponse.data));
        }
      } catch (_error) {
        setAuthToken(null);
      }
    };

    hydrateProfile();
  }, [authToken, currentUser?.isApiUser]);

  const normalizeUser = (user) => {
    const roles = Array.isArray(user?.roles)
      ? user.roles.map((role) => (typeof role === 'string' ? role : role?.role_code || role?.code || role?.name)).filter(Boolean)
      : [];

    const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim();

    return {
      ...user,
      id: user?.id,
      name: user?.name || fullName || user?.username || user?.email || 'User',
      role: roles[0] || user?.role || 'User',
      roles,
      permissions: user?.permissions || {},
      isApiUser: true,
    };
  };

  const moduleCodeMap = {
    users: 'USER_MANAGEMENT',
    dashboard: 'DASHBOARD',
    masterData: 'MASTER_DATA',
    bom: 'BOM_ROUTING',
    sales: 'SALES',
    mrp: 'MRP',
    purchase: 'PURCHASE',
    grn: 'GRN',
    inventory: 'INVENTORY',
    workOrder: 'WORK_ORDER',
    qc: 'QC',
    dispatch: 'DISPATCH',
    reports: 'REPORTS',
  };

  const hasPermission = (module, action) => {
    if (!currentUser) {
      return false;
    }

    if (currentUser.roles?.includes('SUPER_ADMIN')) {
      return true;
    }

    if (currentUser.permissions?.[module]?.[action] === true) {
      return true;
    }

    const moduleCode = moduleCodeMap[module] || module.toUpperCase();
    const actionCode = action.toUpperCase();
    const permissionCodes = currentUser.permission_codes || [];

    if (permissionCodes.includes(`${moduleCode}:${actionCode}`)) {
      return true;
    }

    if (currentUser.isApiUser) {
      return true;
    }

    return false;
  };

  const hasModule = (module) => {
    if (!currentUser) {
      return false;
    }

    if (currentUser.roles?.includes('SUPER_ADMIN')) {
      return true;
    }

    if (currentUser.permissions?.[module]) {
      return true;
    }

    if (currentUser.isApiUser) {
      return true;
    }

    return false;
  };

  const loginWithApi = async ({ email, password }) => {
    const response = await loginUser({ email, password });
    const token = response?.data?.token || response?.token;
    const user = response?.data?.user || response?.user;

    if (!token || !user) {
      throw new Error('Invalid login response');
    }

    setAuthToken(token);
    setCurrentUser(normalizeUser(user));
    return response;
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('erpCurrentUser');
    setCurrentUser(mockUsers[0]);
  };

  const switchUser = (userId) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setAuthToken(null);
      localStorage.removeItem('erpCurrentUser');
      setCurrentUser(user);
    }
  };

  const value = {
    authToken,
    currentUser,
    mockUsers,
    hasPermission,
    hasModule,
    switchUser,
    loginWithApi,
    logout,
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
