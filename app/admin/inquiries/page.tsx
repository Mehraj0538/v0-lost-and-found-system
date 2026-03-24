'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function InquiriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadInquiries();
    }
  }, [user]);

  const loadInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedInquiry = await response.json();
        setInquiries(inquiries.map(inq => inq._id === id ? updatedInquiry.inquiry : inq));
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInquiries(inquiries.filter(inq => inq._id !== id));
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Inquiries Management</h1>
          <Link href="/admin/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Inquiries List */}
        <Card>
          <CardHeader>
            <CardTitle>All Inquiries ({inquiries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
              <p className="text-center text-gray-500">Loading inquiries...</p>
            ) : inquiries.length === 0 ? (
              <p className="text-center text-gray-500">No inquiries found</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div key={inquiry._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{inquiry.name}</p>
                        <p className="text-sm text-gray-600">{inquiry.email}</p>
                      </div>
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleUpdateInquiryStatus(inquiry._id, e.target.value)}
                        className={`px-3 py-1 rounded text-xs font-medium border-0 ${
                          inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{inquiry.message}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInquiry(inquiry._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
