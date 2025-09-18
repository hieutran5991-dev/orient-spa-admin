import { Metadata } from 'next';
import { getAgencies } from '@/api/agency';
import ListPage from '@/components/agencies/ListPage';
import { Agency } from '@/types/agency';

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: "Agencies Management | SPA Admin Dashboard",
  description: "Manage spa agencies, view details, and handle agency operations. Access comprehensive agency information including contact details, operating hours, and capacity.",
  keywords: "spa agencies, agency management, spa locations, contact information, operating hours",
  openGraph: {
    title: "Agencies Management | SPA Admin Dashboard",
    description: "Manage spa agencies, view details, and handle agency operations.",
    type: "website",
  },
};

export default async function AgenciesPage() {
  let agencies: Agency[] = [];
  let isError = false;
  try {
    const response = await getAgencies();
    agencies = response.data?.data || [];

  } catch (error) {
    console.error('Error fetching agencies:', error);
    isError = true;
  }

  return (
    <ListPage agencies={agencies} isError={isError} />
  );
}
