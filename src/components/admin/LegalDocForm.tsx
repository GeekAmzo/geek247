import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { legalDocumentFormSchema, type LegalDocumentFormInput } from '@/schemas/legalSchemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { LegalDocument } from '@/types/legal';

interface LegalDocFormProps {
  document?: LegalDocument;
  onSubmit: (data: LegalDocumentFormInput) => void;
  isSubmitting: boolean;
}

export function LegalDocForm({ document, onSubmit, isSubmitting }: LegalDocFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LegalDocumentFormInput>({
    resolver: zodResolver(legalDocumentFormSchema),
    defaultValues: document
      ? {
          type: document.type,
          title: document.title,
          content: document.content,
          version: document.version,
          serviceId: document.serviceId,
          isActive: document.isActive,
        }
      : {
          type: 'tos',
          title: '',
          content: '',
          version: '1.0',
          serviceId: null,
          isActive: true,
        },
  });

  const docType = watch('type');
  const isActive = watch('isActive');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Document Type</Label>
          <Select value={docType} onValueChange={(val) => setValue('type', val as 'tos' | 'sla')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tos">Terms of Service</SelectItem>
              <SelectItem value="sla">Service Level Agreement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input id="version" {...register('version')} placeholder="1.0" />
          {errors.version && (
            <p className="text-sm text-destructive">{errors.version.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} placeholder="Terms of Service" />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown)</Label>
        <Textarea
          id="content"
          {...register('content')}
          placeholder="Enter the document content..."
          rows={20}
          className="font-mono text-sm"
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Active</Label>
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue('isActive', checked)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : document ? 'Update Document' : 'Create Document'}
      </Button>
    </form>
  );
}
