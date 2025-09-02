import { Metadata } from 'next';
import CreateAgencyForm from '@/components/agencies/CreateAgencyForm';

export const metadata: Metadata = {
  title: "Create New Agency | SPA Admin Dashboard",
  description: "Create a new spa agency with comprehensive information including contact details, operating hours, and capacity.",
  keywords: "create agency, new agency, spa agency, agency form, agency creation",
  openGraph: {
    title: "Create New Agency | SPA Admin Dashboard",
    description: "Create a new spa agency with comprehensive information.",
    type: "website",
  },
};

export default function CreateAgencyPage() {
  return <CreateAgencyForm />;
}
