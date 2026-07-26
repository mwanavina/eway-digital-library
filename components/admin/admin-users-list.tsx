'use client';

import { useState, useEffect } from 'react';
import { fetchAllUsers } from '@/app/actions/admin-users';

export function AdminUsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const result = await fetchAllUsers();
      if (result.success && result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search users by name, email, or level..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Users ({filteredUsers.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Program</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">School</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    {users.length === 0 ? 'No users found' : 'No users match your search'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-slate-200 dark:border-slate-800">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {u.level ? `${u.level} (${u.levelNumber})` : 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.program || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.department || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.school || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          u.onboardingCompleted
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {u.onboardingCompleted ? 'Completed' : 'Incomplete'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
