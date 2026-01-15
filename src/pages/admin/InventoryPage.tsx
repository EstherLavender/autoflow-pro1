import { useState, useEffect } from 'react';
import { Plus, AlertTriangle, Search, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { supabase } from '@/lib/Supabase';
import { toast } from 'sonner';

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = items.filter(i => i.quantity <= i.min_stock_level).length;
  const totalValue = items.reduce((sum, i) => sum + (i.quantity * i.cost_per_unit), 0);

  if (isLoading) {
    return <LoadingState message="Loading inventory..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Inventory</h1>
        <p className="text-muted-foreground mt-1">Track parts and consumables</p>
      </div>

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
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">KES {totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Button variant="default"><Plus className="h-4 w-4 mr-2" />Add Item</Button>
      </div>

      <Card variant="elevated">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Item</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stock</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cost</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isLow = item.quantity <= item.min_stock_level;
                return (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-sm">{item.name}</p>
                      </div>
                    </td>
                    <td className="p-4">{item.quantity} {item.unit}</td>
                    <td className="p-4">KES {item.cost_per_unit.toLocaleString()}</td>
                    <td className="p-4">
                      {isLow ? <Badge variant="warning"><AlertTriangle className="h-3 w-3 mr-1" />Low</Badge> : <Badge variant="success">OK</Badge>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
