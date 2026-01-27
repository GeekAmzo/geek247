import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useActiveLegalDocument } from '@/hooks/useLegalDocuments';
import { Skeleton } from '@/components/ui/skeleton';

export default function ServiceLevelAgreement() {
  const { data: doc, isLoading } = useActiveLegalDocument('sla');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : doc ? (
            <>
              <h1 className="font-display text-4xl font-bold text-foreground mb-2">
                {doc.title}
              </h1>
              <p className="text-sm text-muted-foreground mb-8">Version {doc.version}</p>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {doc.content}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                Service Level Agreement
              </h1>
              <p className="text-muted-foreground">
                Our SLA document is being prepared and will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
