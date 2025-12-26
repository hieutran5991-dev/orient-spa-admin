import { Metadata } from 'next';
import AgenciesClient from './AgenciesClient';

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

export default function AgenciesPage() {
  return <AgenciesClient />;
}
