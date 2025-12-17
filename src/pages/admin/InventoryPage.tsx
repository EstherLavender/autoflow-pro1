import { useState } from 'react';
import { Plus, AlertTriangle, Search, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import AdminLayout from '@/components/layout/AdminLayout';
import { mockInventory } from '@/data/mockData';

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items] = useState(mockInventory);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = items.filter(i => i.quantity <= i.minStockLevel).length;
  const totalValue = items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);

  return (
    <AdminLayout title="Inventory" subtitle="Track parts and consumables">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </CardContent>
        </Card>
        <Card variant="warning">
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Low Stock</p>
            <p className="text-2xl font-bold">{lowStockCount}</p>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Total Inventory Value</p>
            <p className="text-2xl font-bold">KES {totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search inventory..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Inventory Table */}
      <Card variant="elevated">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Item</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stock Level</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Unit Price</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const stockPercentage = (item.quantity / (item.minStockLevel * 2)) * 100;
                const isLow = item.quantity <= item.minStockLevel;
                
                return (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.supplier}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{item.category}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 min-w-[120px]">
                        <div className="flex justify-between text-sm">
                          <span>{item.quantity}</span>
                          <span className="text-muted-foreground">/ {item.minStockLevel * 2}</span>
                        </div>
                        <Progress 
                          value={Math.min(stockPercentage, 100)} 
                          className={`h-2 ${isLow ? '[&>div]:bg-warning' : ''}`}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">KES {item.unitPrice.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      {isLow ? (
                        <Badge variant="warning" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="success">In Stock</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
