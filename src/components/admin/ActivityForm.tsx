import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
import { activityFormSchema, type ActivityFormInput } from '@/schemas/leadSchemas';
import { useCreateActivity } from '@/hooks/useActivities';

interface ActivityFormProps {
  leadId: string;
  onSuccess?: () => void;
}

const activityTypes = [
  { value: 'note', label: 'Note' },
  { value: 'email_sent', label: 'Email Sent' },
  { value: 'call', label: 'Call' },
  { value: 'meeting', label: 'Meeting' },
];

export function ActivityForm({ leadId, onSuccess }: ActivityFormProps) {
  const createActivity = useCreateActivity();

  const form = useForm<ActivityFormInput>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      type: 'note',
      title: '',
      description: '',
    },
  });

  const onSubmit = (data: ActivityFormInput) => {
    createActivity.mutate(
      {
        leadId,
        type: data.type,
        title: data.title,
        description: data.description,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Brief summary..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes or details..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createActivity.isPending}
          className="w-full sm:w-auto"
        >
          {createActivity.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Activity'
          )}
        </Button>
      </form>
    </Form>
  );
}
