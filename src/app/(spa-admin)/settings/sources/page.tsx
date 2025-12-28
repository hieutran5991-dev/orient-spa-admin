import SourcesClient from './SourcesClient';
import { Metadata } from 'next';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export const metadata: Metadata = {
  title: 'Sources - Settings | SPA Admin Dashboard',
  description: 'Manage sources for bookings',
  keywords: 'sources, settings, spa admin',
  openGraph: {
    title: 'Sources - Settings | SPA Admin Dashboard',
    description: 'Manage sources for bookings',
    type: 'website',
  },
};

export default function SourcesPage() {
  return (
    <>
      <PageBreadcrumb 
        pageTitle="Sources"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Settings', href: '/settings/general' },
          { label: 'Source' },
        ]}
      />
      <SourcesClient />
    </>
  );
}

