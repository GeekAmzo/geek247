import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Download } from 'lucide-react';
import { LeadFilters } from '@/components/admin/LeadFilters';
import { LeadTable } from '@/components/admin/LeadTable';
import { ExportButton } from '@/components/admin/ExportButton';
import { useLeads } from '@/hooks/useLeads';
import type { LeadFilters as Filters } from '@/types/crm';

const LeadList = () => {
  const [filters, setFilters] = useState<Filters>({});
  const { data: leads, isLoading } = useLeads(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your leads in one place.
          </p>
        </div>
        <ExportButton leads={leads || []} />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-card border border-border"
      >
        <LeadFilters filters={filters} onFiltersChange={setFilters} />
      </motion.div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        {isLoading ? 'Loading...' : `${leads?.length || 0} leads found`}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LeadTable leads={leads || []} isLoading={isLoading} />
      </motion.div>
    </div>
  );
};

export default LeadList;
