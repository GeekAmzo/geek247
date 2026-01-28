import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Globe,
  Briefcase,
  Calendar,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LeadStatusSelect } from '@/components/admin/LeadStatusSelect';
import { ActivityTimeline } from '@/components/admin/ActivityTimeline';
import { ActivityForm } from '@/components/admin/ActivityForm';
import { ConvertLeadToClient } from '@/components/admin/ConvertLeadToClient';
import { useLead, useUpdateLeadStatus, useDeleteLead } from '@/hooks/useLeads';
import { useActivities } from '@/hooks/useActivities';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { LeadStatus } from '@/types/crm';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading: leadLoading } = useLead(id);
  const { data: activities, isLoading: activitiesLoading } = useActivities(id);
  const updateStatus = useUpdateLeadStatus();
  const deleteLead = useDeleteLead();

  const handleStatusChange = (status: LeadStatus) => {
    if (id) {
      updateStatus.mutate({ id, status });
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteLead.mutate(id, {
        onSuccess: () => navigate('/admin/leads'),
      });
    }
  };

  if (leadLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Lead not found</p>
        <Button variant="outline" onClick={() => navigate('/admin/leads')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/admin/leads"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Leads
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {lead.firstName} {lead.lastName}
          </h1>
          <p className="text-muted-foreground mt-1">{lead.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {lead.status === 'won' && (
            <ConvertLeadToClient lead={lead} />
          )}
          <LeadStatusSelect
            value={lead.status}
            onValueChange={handleStatusChange}
            disabled={updateStatus.isPending}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this lead? This will also remove all
                  associated activities. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lead Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Contact Info */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`mailto:${lead.email}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {lead.email}
                </a>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {lead.phone}
                  </a>
                </div>
              )}
              {lead.company && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>{lead.company}</span>
                </div>
              )}
              {lead.jobTitle && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{lead.jobTitle}</span>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {lead.website.replace(/^https?:\/\//, '')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Lead Details */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-4">Lead Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Source</p>
                <p className="text-foreground capitalize mt-1">
                  {lead.source.replace('_', ' ')}
                </p>
              </div>
              {lead.serviceInterest.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2">Services Interested</p>
                  <div className="flex flex-wrap gap-2">
                    {lead.serviceInterest.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {lead.budgetRange && (
                <div>
                  <p className="text-muted-foreground">Budget Range</p>
                  <p className="text-foreground mt-1">{lead.budgetRange}</p>
                </div>
              )}
              {lead.timeline && (
                <div>
                  <p className="text-muted-foreground">Timeline</p>
                  <p className="text-foreground mt-1">{lead.timeline}</p>
                </div>
              )}
              {lead.message && (
                <div>
                  <p className="text-muted-foreground">Message</p>
                  <p className="text-foreground mt-1 whitespace-pre-wrap">
                    {lead.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Created {format(new Date(lead.createdAt), 'MMM d, yyyy h:mm a')}
            </div>
            {lead.updatedAt !== lead.createdAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="w-4 h-4" />
                Updated {format(new Date(lead.updatedAt), 'MMM d, yyyy h:mm a')}
              </div>
            )}
          </div>
        </motion.div>

        {/* Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-4">Add Activity</h2>
            <ActivityForm leadId={lead.id} />
          </div>

          <div className="p-6 rounded-xl bg-card border border-border mt-6">
            <h2 className="font-semibold text-foreground mb-6">Activity Timeline</h2>
            <ActivityTimeline
              activities={activities || []}
              isLoading={activitiesLoading}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeadDetail;
