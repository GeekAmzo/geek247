import { useState } from 'react';
import { CalendarDays, Clock, Mail, CheckCircle2 } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function PortalBookMeeting() {
  const { user, profile } = useUserAuth();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Submit as a lead/inquiry
    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'meeting_request',
            name: profile?.fullName || '',
            email: user?.email || '',
            company: profile?.company || '',
            phone: profile?.phone || '',
            preferredDate,
            preferredTime,
            topic,
            notes,
            submittedAt: new Date().toISOString(),
          }),
        });
      }
    } catch {
      // Best-effort submission
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 border border-green-500/30">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Meeting Request Sent</h1>
        <p className="text-muted-foreground mb-6">
          We'll get back to you within 24 hours to confirm a meeting time. You can also email us directly at{' '}
          <a href="mailto:amrish@geek247.co.za" className="text-primary hover:underline">
            amrish@geek247.co.za
          </a>
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Request Another Meeting
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Book a Consultation</h1>
        <p className="text-muted-foreground">
          Schedule a free consultation to discuss your business needs
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl border border-border bg-card">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., AI automation for sales process"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requirements or questions..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending request...' : 'Request Meeting'}
            </Button>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-foreground mb-4">What to expect</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Free consultation</p>
                  <p className="text-xs text-muted-foreground">
                    30-minute call to discuss your needs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Quick response</p>
                  <p className="text-xs text-muted-foreground">
                    We'll confirm within 24 business hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Direct contact</p>
                  <p className="text-xs text-muted-foreground">
                    Or email{' '}
                    <a href="mailto:amrish@geek247.co.za" className="text-primary hover:underline">
                      amrish@geek247.co.za
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
            <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
            <p className="text-sm text-muted-foreground">
              Monday - Friday<br />
              08:00 - 18:00 SAST<br />
              (South Africa Standard Time)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
