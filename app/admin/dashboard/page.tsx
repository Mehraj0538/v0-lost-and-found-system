'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalItems: 0,
    pendingItems: 0,
    claimedItems: 0,
    totalUsers: 0,
    totalClaims: 0,
    totalInquiries: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      const [itemsRes, usersRes, claimsRes, inquiriesRes] = await Promise.all([
        fetch('/api/items'),
        fetch('/api/auth/me'),
        fetch('/api/claims'),
        fetch('/api/inquiries'),
      ]);

      if (itemsRes.ok && claimsRes.ok && inquiriesRes.ok) {
        const itemsData = await itemsRes.json();
        const claimsData = await claimsRes.json();
        const inquiriesData = await inquiriesRes.json();

        const items = itemsData.items || [];
        const claims = claimsData.claims || [];
        const inquiries = inquiriesData.inquiries || [];

        setStats({
          totalItems: items.length,
          pendingItems: items.filter((i: any) => i.status === 'pending').length,
          claimedItems: items.filter((i: any) => i.status === 'claimed').length,
          totalUsers: 1,
          totalClaims: claims.length,
          totalInquiries: inquiries.length,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name || user.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-gray-500 mt-1">{stats.pendingItems} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Claimed Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.claimedItems}</div>
              <p className="text-xs text-gray-500 mt-1">Successfully claimed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalClaims}</div>
              <p className="text-xs text-gray-500 mt-1">Need review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalInquiries}</div>
              <p className="text-xs text-gray-500 mt-1">User inquiries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">Admin accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Links */}
        <Card>
          <CardHeader>
            <CardTitle>Management</CardTitle>
            <CardDescription>Quick access to management sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/items">
                <Button variant="outline" className="w-full justify-start">
                  📦 Manage Items
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start">
                  📂 Manage Categories
                </Button>
              </Link>
              <Link href="/admin/claims">
                <Button variant="outline" className="w-full justify-start">
                  ✋ Review Claims
                </Button>
              </Link>
              <Link href="/admin/inquiries">
                <Button variant="outline" className="w-full justify-start">
                  💬 Inquiries
                </Button>
              </Link>
              <Link href="/admin/activity">
                <Button variant="outline" className="w-full justify-start">
                  📊 Activity Log
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  🌐 View Public Site
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
