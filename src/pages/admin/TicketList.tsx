import { useState } from 'react';
import { motion } from 'framer-motion';
import { TicketTable } from '@/components/admin/TicketTable';
import { TicketFilters } from '@/components/admin/TicketFilters';
import { useTickets, useTicketStats } from '@/hooks/useTickets';
import { Skeleton } from '@/components/ui/skeleton';
import type { TicketStatus, TicketPriority, TicketCategory } from '@/types/tickets';
import { Ticket, CircleDot, Clock, CheckCircle2, XCircle } from 'lucide-react';

const TicketList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TicketStatus | 'all'>('all');
  const [priority, setPriority] = useState<TicketPriority | 'all'>('all');
  const [category, setCategory] = useState<TicketCategory | 'all'>('all');

  const { data: tickets, isLoading } = useTickets({
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
    priority: priority !== 'all' ? priority : undefined,
    category: category !== 'all' ? category : undefined,
  });

  const { data: stats } = useTicketStats();

  const statCards = [
    { label: 'Open', value: stats?.open ?? 0, icon: CircleDot, color: 'text-blue-500' },
    { label: 'In Progress', value: stats?.in_progress ?? 0, icon: Clock, color: 'text-yellow-500' },
    { label: 'Resolved', value: stats?.resolved ?? 0, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Closed', value: stats?.closed ?? 0, icon: XCircle, color: 'text-gray-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
        <p className="text-muted-foreground mt-1">Manage customer support requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <TicketFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        category={category}
        onCategoryChange={setCategory}
      />

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <TicketTable tickets={tickets || []} />
        )}
      </motion.div>
    </div>
  );
};

export default TicketList;
