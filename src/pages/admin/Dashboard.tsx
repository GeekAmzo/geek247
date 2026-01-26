import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  TrendingUp,
  Calendar,
  ArrowRight,
  Mail,
  Phone,
} from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import { useLeadStats, useRecentLeads } from '@/hooks/useLeads';
import { Skeleton } from '@/components/ui/skeleton';
import { LEAD_STATUSES } from '@/types/crm';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useLeadStats();
  const { data: recentLeads, isLoading: leadsLoading } = useRecentLeads(5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your leads.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Total Leads"
              value={stats?.total || 0}
              icon={Users}
            />
            <StatsCard
              title="New This Month"
              value={stats?.thisMonth || 0}
              icon={Calendar}
            />
            <StatsCard
              title="Conversion Rate"
              value={`${stats?.conversionRate || 0}%`}
              icon={TrendingUp}
            />
            <StatsCard
              title="New Leads"
              value={stats?.byStatus.new || 0}
              icon={UserPlus}
            />
          </>
        )}
      </div>

      {/* Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Leads by Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {LEAD_STATUSES.map((status) => (
            <div
              key={status.value}
              className="p-4 rounded-lg bg-muted/50 text-center"
            >
              <p className="text-2xl font-bold text-foreground">
                {statsLoading ? '-' : stats?.byStatus[status.value] || 0}
              </p>
              <LeadStatusBadge status={status.value} className="mt-2" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Leads</h2>
          <Link
            to="/admin/leads"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {leadsLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : recentLeads && recentLeads.length > 0 ? (
          <div className="divide-y divide-border">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                to={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between py-4 hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="w-3.5 h-3.5" />
                      {lead.email}
                    </span>
                    {lead.company && (
                      <span className="truncate hidden sm:inline">
                        {lead.company}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <LeadStatusBadge status={lead.status} />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No leads yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Leads submitted through the contact form will appear here.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
