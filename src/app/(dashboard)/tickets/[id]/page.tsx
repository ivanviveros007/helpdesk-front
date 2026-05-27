import { TicketDetailScreen } from "@/screens/TicketDetailScreen";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Detalle de ticket — Helpdesk AI" };

export default async function TicketDetailPage({ params }: Props) {
  const { id } = await params;
  return <TicketDetailScreen ticketId={id} />;
}
