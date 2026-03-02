import { apiRequest } from './http';

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

export const getUsers = (params) => apiRequest(`/users${buildQuery(params)}`);
export const getUserById = (id) => apiRequest(`/users/${id}`);
export const createUser = (payload) => apiRequest('/users', { method: 'POST', body: payload });
export const updateUser = (id, payload) => apiRequest(`/users/${id}`, { method: 'PUT', body: payload });
export const deleteUser = (id) => apiRequest(`/users/${id}`, { method: 'DELETE' });
export const updateUserPassword = (id, payload) => apiRequest(`/users/${id}/password`, { method: 'PUT', body: payload });

export const getUserRoles = (params) => apiRequest(`/user-roles${buildQuery(params)}`);
export const getRolesForUser = (userId) => apiRequest(`/user-roles/user/${userId}`);
export const getUsersByRole = (roleId) => apiRequest(`/user-roles/role/${roleId}`);
export const assignRoleToUser = (payload) => apiRequest('/user-roles', { method: 'POST', body: payload });
export const bulkAssignRolesToUser = (payload) => apiRequest('/user-roles/bulk', { method: 'POST', body: payload });
export const removeRoleFromUser = (payload) => apiRequest('/user-roles', { method: 'DELETE', body: payload });

export const getRoles = () => apiRequest('/roles');
export const getRoleById = (id) => apiRequest(`/roles/${id}`);
export const createRole = (payload) => apiRequest('/roles', { method: 'POST', body: payload });
export const updateRole = (id, payload) => apiRequest(`/roles/${id}`, { method: 'PUT', body: payload });
export const deleteRole = (id) => apiRequest(`/roles/${id}`, { method: 'DELETE' });
export const assignPermissionToRole = (payload) => apiRequest('/roles/permissions', { method: 'POST', body: payload });
export const removePermissionFromRole = (payload) => apiRequest('/roles/permissions', { method: 'DELETE', body: payload });

export const getPermissions = () => apiRequest('/permissions');
export const getPermissionById = (id) => apiRequest(`/permissions/${id}`);
export const createPermission = (payload) => apiRequest('/permissions', { method: 'POST', body: payload });
export const updatePermission = (id, payload) => apiRequest(`/permissions/${id}`, { method: 'PUT', body: payload });
export const deletePermission = (id) => apiRequest(`/permissions/${id}`, { method: 'DELETE' });

export const getModules = () => apiRequest('/modules');
export const getModuleById = (id) => apiRequest(`/modules/${id}`);
export const createModule = (payload) => apiRequest('/modules', { method: 'POST', body: payload });
export const updateModule = (id, payload) => apiRequest(`/modules/${id}`, { method: 'PUT', body: payload });
export const deleteModule = (id) => apiRequest(`/modules/${id}`, { method: 'DELETE' });
