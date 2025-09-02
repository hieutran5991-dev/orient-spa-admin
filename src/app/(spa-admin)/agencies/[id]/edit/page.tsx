import { Metadata } from 'next';
import EditAgencyForm from '@/components/agencies/EditAgencyForm';

export const metadata: Metadata = {
  title: "Edit Agency | SPA Admin Dashboard",
  description: "Edit existing spa agency information including contact details, operating hours, and capacity.",
  keywords: "edit agency, update agency, agency management, spa agency editing",
  openGraph: {
    title: "Edit Agency | SPA Admin Dashboard",
    description: "Edit existing spa agency information.",
    type: "website",
  },
};

export default function EditAgencyPage() {
  return <EditAgencyForm />;
}
