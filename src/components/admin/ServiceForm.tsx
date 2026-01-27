import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceFormSchema, type ServiceFormInput } from '@/schemas/serviceSchemas';
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
import { Plus, Trash2 } from 'lucide-react';
import type { Service } from '@/types/services';

interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: ServiceFormInput) => void;
  isSubmitting: boolean;
}

export function ServiceForm({ service, onSubmit, isSubmitting }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service
      ? {
          slug: service.slug,
          title: service.title,
          shortDescription: service.shortDescription,
          longDescription: service.longDescription,
          featuresIncluded: service.featuresIncluded,
          featuresNotIncluded: service.featuresNotIncluded,
          faqs: service.faqs,
          pricingZarMinCents: service.pricingZarMinCents,
          pricingZarMaxCents: service.pricingZarMaxCents,
          pricingUsdMinCents: service.pricingUsdMinCents,
          pricingUsdMaxCents: service.pricingUsdMaxCents,
          billingInterval: service.billingInterval,
          paystackPlanCodeZar: service.paystackPlanCodeZar,
          paystackPlanCodeUsd: service.paystackPlanCodeUsd,
          isActive: service.isActive,
          sortOrder: service.sortOrder,
        }
      : {
          slug: '',
          title: '',
          shortDescription: '',
          longDescription: '',
          featuresIncluded: [],
          featuresNotIncluded: [],
          faqs: [],
          pricingZarMinCents: 0,
          pricingZarMaxCents: null,
          pricingUsdMinCents: 0,
          pricingUsdMaxCents: null,
          billingInterval: 'monthly',
          paystackPlanCodeZar: null,
          paystackPlanCodeUsd: null,
          isActive: true,
          sortOrder: 0,
        },
  });

  const {
    fields: includedFields,
    append: appendIncluded,
    remove: removeIncluded,
  } = useFieldArray({ control, name: 'featuresIncluded' });

  const {
    fields: excludedFields,
    append: appendExcluded,
    remove: removeExcluded,
  } = useFieldArray({ control, name: 'featuresNotIncluded' });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: 'faqs' });

  const billingInterval = watch('billingInterval');
  const isActive = watch('isActive');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} placeholder="AI Process Automation" />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register('slug')} placeholder="ai-process-automation" />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            {...register('shortDescription')}
            placeholder="Brief description for cards and previews"
            rows={2}
          />
          {errors.shortDescription && (
            <p className="text-sm text-destructive">{errors.shortDescription.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="longDescription">Long Description</Label>
          <Textarea
            id="longDescription"
            {...register('longDescription')}
            placeholder="Detailed description for the service page"
            rows={5}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Pricing</h3>

        <div className="space-y-2">
          <Label>Billing Interval</Label>
          <Select
            value={billingInterval}
            onValueChange={(val) => setValue('billingInterval', val as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="once_off">Once-off</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ZAR Min (cents)</Label>
            <Input
              type="number"
              {...register('pricingZarMinCents', { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>ZAR Max (cents, optional)</Label>
            <Input
              type="number"
              {...register('pricingZarMaxCents', { setValueAs: (v) => (v === '' ? null : Number(v)) })}
            />
          </div>
          <div className="space-y-2">
            <Label>USD Min (cents)</Label>
            <Input
              type="number"
              {...register('pricingUsdMinCents', { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>USD Max (cents, optional)</Label>
            <Input
              type="number"
              {...register('pricingUsdMaxCents', { setValueAs: (v) => (v === '' ? null : Number(v)) })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Paystack Plan Code (ZAR)</Label>
            <Input
              {...register('paystackPlanCodeZar', { setValueAs: (v) => v || null })}
              placeholder="PLN_xxxxxxxx"
            />
          </div>
          <div className="space-y-2">
            <Label>Paystack Plan Code (USD)</Label>
            <Input
              {...register('paystackPlanCodeUsd', { setValueAs: (v) => v || null })}
              placeholder="PLN_xxxxxxxx"
            />
          </div>
        </div>
      </div>

      {/* Features Included */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Features Included</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendIncluded({ text: '', included: true })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        {includedFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...register(`featuresIncluded.${index}.text`)}
              placeholder="Feature description"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeIncluded(index)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {/* Features Not Included */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Features Not Included</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendExcluded({ text: '', included: false })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        {excludedFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...register(`featuresNotIncluded.${index}.text`)}
              placeholder="Exclusion description"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeExcluded(index)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">FAQs</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendFaq({ question: '', answer: '' })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        {faqFields.map((field, index) => (
          <div key={field.id} className="space-y-2 p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <Label>FAQ #{index + 1}</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFaq(index)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <Input
              {...register(`faqs.${index}.question`)}
              placeholder="Question"
            />
            <Textarea
              {...register(`faqs.${index}.answer`)}
              placeholder="Answer"
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Settings</h3>

        <div className="flex items-center justify-between">
          <Label htmlFor="isActive">Active</Label>
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setValue('isActive', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input
            type="number"
            {...register('sortOrder', { valueAsNumber: true })}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
      </Button>
    </form>
  );
}
