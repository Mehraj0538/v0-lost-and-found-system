'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, LogOut, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Claim {
  _id: string;
  itemId?: { referenceCode: string; title: string };
  claimedBy?: { name: string; email: string };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  description: string;
  claimDate: string;
}

export default function ClaimsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchClaims();
    }
  }, [user]);

  const fetchClaims = async () => {
    try {
      const response = await fetch('/api/claims');
      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims || []);
      }
    } catch (error) {
      console.error('Failed to fetch claims:', error);
    } finally {
      setClaimsLoading(false);
    }
  };

  const updateClaimStatus = async (claimId: string, newStatus: string) => {
    setUpdating(claimId);
    try {
      const response = await fetch(`/api/claims/${claimId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        setClaims(
          claims.map((claim) =>
            claim._id === claimId ? { ...claim, status: newStatus as any } : claim
          )
        );
      } else {
        alert('Failed to update claim');
      }
    } catch (error) {
      console.error('Error updating claim:', error);
      alert('Error updating claim');
    } finally {
      setUpdating(null);
    }
  };

  if (loading || claimsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const pendingClaims = claims.filter((c) => c.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Claims</h1>
            <p className="text-sm text-gray-600">Pending: {pendingClaims.length}</p>
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
        {/* Pending Claims */}
        {pendingClaims.length > 0 && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-900">Pending Claims ({pendingClaims.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingClaims.map((claim) => (
                  <div key={claim._id} className="p-4 bg-white rounded-lg border border-yellow-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{claim.itemId?.title}</p>
                        <p className="text-sm text-gray-600">{claim.itemId?.referenceCode}</p>
                        <p className="text-sm text-gray-600">Claimant: {claim.claimedBy?.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateClaimStatus(claim._id, 'approved')}
                          disabled={updating === claim._id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateClaimStatus(claim._id, 'rejected')}
                          disabled={updating === claim._id}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{claim.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Claims */}
        <Card>
          <CardHeader>
            <CardTitle>All Claims</CardTitle>
          </CardHeader>
          <CardContent>
            {claims.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No claims found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Item</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Claimant</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Claim Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim) => (
                      <tr key={claim._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{claim.itemId?.title}</p>
                            <p className="text-xs text-gray-500">{claim.itemId?.referenceCode}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{claim.claimedBy?.name}</p>
                            <p className="text-xs text-gray-500">{claim.claimedBy?.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              claim.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : claim.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : claim.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(claim.claimDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
