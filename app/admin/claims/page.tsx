'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function ClaimsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [claims, setClaims] = useState<any[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadClaims();
    }
  }, [user]);

  const loadClaims = async () => {
    try {
      const response = await fetch('/api/claims');
      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims || []);
      }
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setClaimsLoading(false);
    }
  };

  const handleUpdateClaimStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/claims/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedClaim = await response.json();
        setClaims(claims.map(claim => claim._id === id ? updatedClaim.claim : claim));
      }
    } catch (error) {
      console.error('Error updating claim:', error);
    }
  };

  const handleDeleteClaim = async (id: string) => {
    if (!confirm('Are you sure you want to delete this claim?')) return;

    try {
      const response = await fetch(`/api/claims/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClaims(claims.filter(claim => claim._id !== id));
      }
    } catch (error) {
      console.error('Error deleting claim:', error);
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
          <h1 className="text-3xl font-bold">Claims Management</h1>
          <Link href="/admin/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Claims List */}
        <Card>
          <CardHeader>
            <CardTitle>All Claims ({claims.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {claimsLoading ? (
              <p className="text-center text-gray-500">Loading claims...</p>
            ) : claims.length === 0 ? (
              <p className="text-center text-gray-500">No claims found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 px-2">Claim ID</th>
                      <th className="text-left py-2 px-2">Claimant</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Date</th>
                      <th className="text-left py-2 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim) => (
                      <tr key={claim._id} className="border-b border-gray-100">
                        <td className="py-3 px-2 font-mono text-xs">{claim._id.substring(0, 8)}...</td>
                        <td className="py-3 px-2">{claim.claimedBy?.email || 'Unknown'}</td>
                        <td className="py-3 px-2">
                          <select
                            value={claim.status}
                            onChange={(e) => handleUpdateClaimStatus(claim._id, e.target.value)}
                            className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                              claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 px-2">{new Date(claim.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClaim(claim._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
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
    </main>
  );
}
