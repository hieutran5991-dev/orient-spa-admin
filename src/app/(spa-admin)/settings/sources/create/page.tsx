import CreateSourceForm from '@/components/sources/CreateSourceForm';
import { Metadata } from 'next';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export const metadata: Metadata = {
  title: 'Create Source - Settings | SPA Admin Dashboard',
  description: 'Create a new source',
  keywords: 'create source, settings, spa admin',
  openGraph: {
    title: 'Create Source - Settings | SPA Admin Dashboard',
    description: 'Create a new source',
    type: 'website',
  },
};

export default function CreateSourcePage() {
  return (
    <>
      <PageBreadcrumb 
        pageTitle="Create Source"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Settings', href: '/settings/general' },
          { label: 'Source', href: '/settings/sources' },
          { label: 'Create Source' },
        ]}
      />
      <CreateSourceForm />
    </>
  );
}

