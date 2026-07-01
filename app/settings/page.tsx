'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { ChevronRight, Bell, Lock, Eye, HelpCircle, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  const settingSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Push Notifications',
          description: 'Receive notifications about new resources',
          toggle: notificationsEnabled,
          onChange: setNotificationsEnabled,
        },
        {
          label: 'Email Updates',
          description: 'Receive email updates about new documents',
          toggle: emailUpdates,
          onChange: setEmailUpdates,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Lock,
      items: [
        {
          label: 'Private Profile',
          description: 'Make your profile private',
          toggle: privateProfile,
          onChange: setPrivateProfile,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col">
      <Header />
      <BottomNav activeTab="browse" />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and settings</p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {settingSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 px-4 md:px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <Icon size={20} className="text-gray-700" />
                    <h2 className="font-semibold text-gray-900">{section.title}</h2>
                  </div>

                  {/* Section Items */}
                  <div className="divide-y divide-gray-200">
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="px-4 md:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => item.onChange(!item.toggle)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              item.toggle ? 'bg-[#1782C5]' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                item.toggle ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Help & Support Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 px-4 md:px-6 py-4 bg-gray-50 border-b border-gray-200">
                <HelpCircle size={20} className="text-gray-700" />
                <h2 className="font-semibold text-gray-900">Help & Support</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { label: 'FAQ', description: 'Frequently asked questions' },
                  { label: 'Contact Support', description: 'Get help from our support team' },
                  { label: 'Terms & Privacy', description: 'Review our terms and privacy policy' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Logout Button */}
            <button className="w-full px-4 md:px-6 py-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-red-600 font-medium">
              <LogOut size={20} />
              Log out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
