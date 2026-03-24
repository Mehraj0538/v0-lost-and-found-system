'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Heart, AlertCircle, CheckCircle } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

export default function SubmitPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    itemType: 'found',
    location: '',
    foundDate: '',
    lostDate: '',
    contact: {
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        if (data.categories && data.categories.length > 0) {
          setFormData((prev) => ({ ...prev, category: data.categories[0]._id }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit item');
      }

      const data = await response.json();
      setReferenceCode(data.item.referenceCode);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Lost & Found</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/browse">
              <Button variant="ghost">Browse Items</Button>
            </Link>
            <Link href="/submit">
              <Button variant="ghost">Submit Item</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Success Message */}
      {submitted && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-green-900">Item Submitted Successfully!</h2>
                <p className="text-green-700 mt-1">
                  Your reference code is: <span className="font-mono font-bold">{referenceCode}</span>
                </p>
                <p className="text-green-700 text-sm mt-2">
                  Use this code to track your submission. Please keep it for your records.
                </p>
                <div className="mt-4 flex gap-2">
                  <Link href="/browse">
                    <Button className="bg-green-600 hover:bg-green-700">View All Items</Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        title: '',
                        description: '',
                        category: categories[0]?._id || '',
                        itemType: 'found',
                        location: '',
                        foundDate: '',
                        lostDate: '',
                        contact: { name: '', email: '', phone: '' },
                      });
                    }}
                  >
                    Submit Another
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Report an Item</CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              Help us reconnect people with their lost items. Fill out the form below.
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Item Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['found', 'lost'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, itemType: type as 'found' | 'lost' })}
                      className={`p-3 rounded-lg border-2 transition text-left ${
                        formData.itemType === type
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">
                        {type === 'found' ? 'I Found an Item' : 'I Lost an Item'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {type === 'found'
                          ? 'Report an item you discovered'
                          : 'Report an item you are looking for'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Item Title</label>
                <Input
                  placeholder="e.g., Black iPhone 14 Pro"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  placeholder="Describe the item in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <Input
                  placeholder="Where was the item found/lost?"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {formData.itemType === 'found' ? 'Date Found' : 'Date Lost'}
                </label>
                <Input
                  type="date"
                  value={formData.itemType === 'found' ? formData.foundDate : formData.lostDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [formData.itemType === 'found' ? 'foundDate' : 'lostDate']: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-medium text-gray-900">Contact Information</h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your Name</label>
                  <Input
                    placeholder="Full name"
                    value={formData.contact.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, name: e.target.value },
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.contact.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, email: e.target.value },
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <Input
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.contact.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, phone: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 h-10"
              >
                {submitting ? 'Submitting...' : 'Submit Item'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
