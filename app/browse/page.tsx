'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Heart, Search, Filter, MapPin, Calendar } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  color: string;
  icon: string;
}

interface Item {
  _id: string;
  referenceCode: string;
  title: string;
  description: string;
  category?: Category;
  itemType: 'found' | 'lost';
  location: string;
  foundDate?: string;
  lostDate?: string;
  status: string;
  contact: { name: string; phone: string };
}

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [itemType, setItemType] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        fetch('/api/items?limit=100'),
        fetch('/api/categories'),
      ]);

      if (itemsRes.ok && categoriesRes.ok) {
        const itemsData = await itemsRes.json();
        const categoriesData = await categoriesRes.json();

        setItems(itemsData.items || []);
        setCategories(categoriesData.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || item.category?._id === selectedCategory;
    const matchesType = !itemType || item.itemType === itemType;
    return matchesSearch && matchesCategory && matchesType;
  });

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

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Items</h1>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>

              <Button
                variant={itemType === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setItemType('')}
              >
                All Types
              </Button>
              <Button
                variant={itemType === 'found' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setItemType('found')}
              >
                Found Items
              </Button>
              <Button
                variant={itemType === 'lost' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setItemType('lost')}
              >
                Lost Items
              </Button>

              <div className="w-px bg-gray-200 mx-2" />

              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat._id}
                  variant={selectedCategory === cat._id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat._id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600 mb-6">
          Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </p>

        {filteredItems.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No items found matching your search</p>
            <Button onClick={() => { setSearch(''); setSelectedCategory(''); setItemType(''); }}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.itemType === 'found'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.itemType === 'found' ? 'Found' : 'Lost'}
                    </span>
                    {item.category && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: item.category.color }}
                      >
                        {item.category.icon.charAt(0)}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-sm font-mono text-blue-600">{item.referenceCode}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>

                  {(item.foundDate || item.lostDate) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.foundDate || item.lostDate || '').toLocaleDateString()}
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-600 mb-2">
                      Contact: <span className="font-medium">{item.contact.name}</span>
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                      Phone: <a href={`tel:${item.contact.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">{item.contact.phone}</a>
                    </p>
                    {item.itemType === 'found' && (
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                        Claim This Item
                      </Button>
                    )}
                    {item.itemType === 'lost' && (
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                        I Found This
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
