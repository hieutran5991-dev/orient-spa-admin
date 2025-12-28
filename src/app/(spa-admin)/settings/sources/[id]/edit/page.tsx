import EditSourceForm from '@/components/sources/EditSourceForm';
import { Metadata } from 'next';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export const metadata: Metadata = {
  title: 'Edit Source - Settings | SPA Admin Dashboard',
  description: 'Edit source information',
  keywords: 'edit source, settings, spa admin',
  openGraph: {
    title: 'Edit Source - Settings | SPA Admin Dashboard',
    description: 'Edit source information',
    type: 'website',
  },
};

export default async function EditSourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <PageBreadcrumb 
        pageTitle="Edit Source"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Settings', href: '/settings/general' },
          { label: 'Source', href: '/settings/sources' },
          { label: 'Edit Source' },
        ]}
      />
      <EditSourceForm sourceId={parseInt(id)} />
    </>
  );
}

