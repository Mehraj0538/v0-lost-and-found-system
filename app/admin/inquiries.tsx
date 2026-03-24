'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, LogOut, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'viewed' | 'responded';
  createdAt: string;
}

export default function InquiriesPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchInquiries();
    }
  }, [user]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setInquiries(inquiries.filter((inq) => inq._id !== id));
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(null);
        }
      } else {
        alert('Failed to delete inquiry');
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Error deleting inquiry');
    } finally {
      setDeleting(null);
    }
  };

  if (loading || inquiriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const newInquiries = inquiries.filter((i) => i.status === 'new');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
            <p className="text-sm text-gray-600">New: {newInquiries.length}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inquiries List */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Inquiries ({inquiries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {inquiries.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No inquiries</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {inquiries.map((inquiry) => (
                    <button
                      key={inquiry._id}
                      onClick={() => setSelectedInquiry(inquiry)}
                      className={`w-full text-left p-3 rounded-lg border transition ${
                        selectedInquiry?._id === inquiry._id
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-sm text-gray-900 truncate">{inquiry.subject}</p>
                      <p className="text-xs text-gray-600 truncate">{inquiry.name}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                          inquiry.status === 'new'
                            ? 'bg-red-100 text-red-800'
                            : inquiry.status === 'viewed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inquiry Detail */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedInquiry ? 'Inquiry Details' : 'Select an inquiry to view'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedInquiry ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subject</label>
                    <p className="mt-1 text-gray-900">{selectedInquiry.subject}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">From</label>
                    <p className="mt-1 text-gray-900">{selectedInquiry.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <a href={`mailto:${selectedInquiry.email}`} className="mt-1 text-blue-600 hover:text-blue-700">
                        {selectedInquiry.email}
                      </a>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <a href={`tel:${selectedInquiry.phone}`} className="mt-1 text-blue-600 hover:text-blue-700">
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Message</label>
                    <p className="mt-1 p-3 bg-gray-50 rounded text-gray-900 whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                        selectedInquiry.status === 'new'
                          ? 'bg-red-100 text-red-800'
                          : selectedInquiry.status === 'viewed'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {selectedInquiry.status.charAt(0).toUpperCase() + selectedInquiry.status.slice(1)}
                    </span>
                  </div>

                  <div className="pt-4 border-t flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => deleteInquiry(selectedInquiry._id)}
                      disabled={deleting === selectedInquiry._id}
                    >
                      <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>Select an inquiry to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
