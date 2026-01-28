import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliverableFormSchema, type DeliverableFormInput } from '@/schemas/projectSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DELIVERABLE_STATUSES, type ProjectMilestone } from '@/types/projects';

interface DeliverableFormProps {
  milestones: ProjectMilestone[];
  onSubmit: (data: DeliverableFormInput) => void;
  isLoading?: boolean;
}

export function DeliverableForm({ milestones, onSubmit, isLoading }: DeliverableFormProps) {
  const form = useForm<DeliverableFormInput>({
    resolver: zodResolver(deliverableFormSchema),
    defaultValues: { title: '', description: '', status: 'pending', milestoneId: 'none', acceptanceCriteria: '', dueDate: '' },
  });

  const handleSubmit = (data: DeliverableFormInput) => {
    onSubmit({ ...data, milestoneId: data.milestoneId === 'none' ? '' : data.milestoneId });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl><Input placeholder="Deliverable title" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea placeholder="Description..." rows={2} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {DELIVERABLE_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          {milestones.length > 0 && (
            <FormField control={form.control} name="milestoneId" render={({ field }) => (
              <FormItem>
                <FormLabel>Milestone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {milestones.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          )}
        </div>
        <FormField control={form.control} name="acceptanceCriteria" render={({ field }) => (
          <FormItem>
            <FormLabel>Acceptance Criteria</FormLabel>
            <FormControl><Textarea placeholder="Acceptance criteria..." rows={2} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="dueDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Deliverable'}
        </Button>
      </form>
    </Form>
  );
}
