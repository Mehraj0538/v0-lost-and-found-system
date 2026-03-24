'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function TrackPage() {
  const [referenceCode, setReferenceCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');
  const [submission, setSubmission] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Extract the ID from reference code (format: LF-2024-XXXX)
      const id = referenceCode.split('-').pop();
      const response = await fetch(`/api/items?referenceCode=${referenceCode}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setSubmission(data.items[0]);
          setStatus('found');
        } else {
          setStatus('not-found');
        }
      } else {
        setStatus('not-found');
      }
    } catch (error) {
      console.error('Error tracking submission:', error);
      setStatus('not-found');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Track Your Submission</h1>
            <p className="text-muted-foreground">
              Enter your reference code to check the status of your lost or found item submission
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Reference Code Lookup</CardTitle>
              <CardDescription>
                You can find your reference code in the confirmation email sent when you submitted the item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrack} className="space-y-4">
                <div>
                  <Input
                    placeholder="e.g., LF-2024-0001"
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                    disabled={status === 'loading'}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!referenceCode || status === 'loading'}
                >
                  {status === 'loading' ? 'Searching...' : 'Track Submission'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {status === 'found' && submission && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900">Submission Found</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Reference Code</p>
                    <p className="font-semibold">{submission.referenceCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Item Type</p>
                    <p className="font-semibold">{submission.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold capitalize">{submission.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-semibold">{new Date(submission.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{submission.description}</p>
                </div>
                {submission.status === 'claimed' && (
                  <div className="bg-blue-100 border border-blue-300 rounded p-3 text-sm text-blue-900">
                    <strong>Update:</strong> This item has been claimed. Please check your email for further instructions.
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {status === 'not-found' && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-900">No Results Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-800">
                  We couldn't find a submission with the reference code "{referenceCode}". 
                  Please double-check the code and try again.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-8">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
