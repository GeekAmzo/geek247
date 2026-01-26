import { Download, FileJson, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportLeads, type ExportFormat } from '@/services/exportService';
import type { Lead } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  leads: Lead[];
}

export function ExportButton({ leads }: ExportButtonProps) {
  const { toast } = useToast();

  const handleExport = (format: ExportFormat) => {
    if (leads.length === 0) {
      toast({
        title: 'No leads to export',
        description: 'There are no leads matching your current filters.',
        variant: 'destructive',
      });
      return;
    }

    try {
      exportLeads(leads, format);
      toast({
        title: 'Export successful',
        description: `Exported ${leads.length} leads to ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting the leads.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
