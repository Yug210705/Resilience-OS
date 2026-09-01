import { redirect } from 'next/navigation';

export default function DisruptionsIndexPage() {
  // Redirect to the default fallback simulation ID 
  // so clicking the sidebar link always opens a dashboard
  redirect('/disruptions/SIM-2025-05-17-001');
}
