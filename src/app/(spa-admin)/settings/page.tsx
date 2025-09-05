import SettingsClient from './SettingsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - Spa Admin Dashboard',
  description: 'Manage spa settings and configuration',
  keywords: 'spa settings, spa configuration, spa admin dashboard',
  openGraph: {
    title: 'Settings - Spa Admin Dashboard',
    description: 'Manage spa settings and configuration',
    type: 'website',
  },
};

export default async function SettingsPage() {
  return <SettingsClient />;
}
