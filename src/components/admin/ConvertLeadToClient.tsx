import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCheck } from 'lucide-react';
import { useCreateClient } from '@/hooks/useClients';
import { useClientByLeadId } from '@/hooks/useClients';
import type { Lead } from '@/types/crm';

interface ConvertLeadToClientProps {
  lead: Lead;
}

export function ConvertLeadToClient({ lead }: ConvertLeadToClientProps) {
  const navigate = useNavigate();
  const createClient = useCreateClient();
  const { data: existingClient } = useClientByLeadId(lead.id);
  const [isConverting, setIsConverting] = useState(false);

  if (existingClient) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/admin/clients/${existingClient.id}`)}
      >
        <UserCheck className="w-4 h-4 mr-2" />
        View Client
      </Button>
    );
  }

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const newClient = await createClient.mutateAsync({
        companyName: lead.company || `${lead.firstName} ${lead.lastName}`,
        contactName: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: lead.phone,
        website: lead.website,
        status: 'active',
        leadId: lead.id,
      });

      if (newClient) {
        navigate(`/admin/clients/${newClient.id}`);
      }
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleConvert}
      disabled={isConverting}
    >
      <UserCheck className="w-4 h-4 mr-2" />
      {isConverting ? 'Converting...' : 'Convert to Client'}
    </Button>
  );
}
