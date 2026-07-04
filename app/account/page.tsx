'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Edit2, Mail, Phone, MapPin, Calendar, FileText, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function AccountPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    university: '',
    dateJoined: '',
  });

  const [tempFormData, setTempFormData] = useState(formData);

  useEffect(() => {
    if (!currentUser) return;

    const [firstName = '', ...lastNameParts] = currentUser.name?.split(/\s+/) ?? [];
    const lastName = lastNameParts.join(' ');
    const joinedDate = currentUser.createdAt
      ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

    const nextProfile = {
      firstName,
      lastName,
      email: currentUser.email ?? '',
      phone: '',
      country: '',
      university: '',
      dateJoined: joinedDate,
    };

    setFormData(nextProfile);
    setTempFormData(nextProfile);
  }, [currentUser?.name, currentUser?.email, currentUser?.createdAt]);

  const handleEditClick = () => {
    setTempFormData(formData);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setFormData(tempFormData);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col">
      <Header />
      <BottomNav activeTab="account" />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          {/* Profile Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">
              {currentUser?.name ? `Signed in as ${currentUser.name}` : 'Manage your profile information'}
            </p>
          </div>

          {/* Profile Card */}
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-card dark:bg-slate-900">
            {/* Header with Edit Button */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1782C5] hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              ) : null}
            </div>

            {/* Profile Content */}
            <div className="p-4 md:p-6">
              {isEditing ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={tempFormData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={tempFormData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={tempFormData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveClick}
                      className="flex-1 px-4 py-2 bg-[#1782C5] text-white font-medium rounded-lg hover:bg-[#1470a8] transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">First Name</p>
                      <p className="text-base font-medium text-gray-900">{formData.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Last Name</p>
                      <p className="text-base font-medium text-gray-900">{formData.lastName}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Mail size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-base text-gray-900">{formData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <Phone size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-base text-gray-900">{formData.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="text-base text-gray-900">{formData.dateJoined}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Card */}
          <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="px-4 md:px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Activity</h2>
            </div>
            <div className="p-4 md:p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Downloads</span>
                <span className="font-semibold text-gray-900">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Saved Resources</span>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Last Access</span>
                <span className="font-semibold text-gray-900">Today</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border border-red-200 rounded-lg bg-red-50 p-4 md:p-6">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
