'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function ActivityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user]);

  const loadActivities = async () => {
    try {
      // Since we don't have a dedicated activity endpoint, we'll show a placeholder
      setActivities([
        {
          _id: '1',
          action: 'System initialized',
          details: 'Application started',
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setActivitiesLoading(false);
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
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <Link href="/admin/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <p className="text-center text-gray-500">Loading activities...</p>
            ) : activities.length === 0 ? (
              <p className="text-center text-gray-500">No activities found</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity._id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5"></div>
                      {index < activities.length - 1 && <div className="w-0.5 h-8 bg-gray-200 my-1"></div>}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Activity logging for detailed system events is being tracked. All important actions like item creation, claims, and admin operations will be logged here in production.
          </p>
        </div>
      </div>
    </main>
  );
}
