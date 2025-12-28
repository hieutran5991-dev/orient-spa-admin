import SettingsClient from '../SettingsClient';
import { Metadata } from 'next';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export const metadata: Metadata = {
  title: 'General Settings - Settings | SPA Admin Dashboard',
  description: 'Manage general spa settings and configuration',
  keywords: 'general settings, spa settings, spa configuration, spa admin dashboard',
  openGraph: {
    title: 'General Settings - Settings | SPA Admin Dashboard',
    description: 'Manage general spa settings and configuration',
    type: 'website',
  },
};

export default async function GeneralSettingsPage() {
  return (
    <>
      <PageBreadcrumb 
        pageTitle="General Information"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Settings', href: '/settings/general' },
          { label: 'General Information' },
        ]}
      />
      <SettingsClient />
    </>
  );
}

