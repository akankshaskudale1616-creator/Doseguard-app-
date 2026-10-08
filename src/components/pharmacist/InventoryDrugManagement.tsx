import React, { useState } from 'react';
import { DrugInventoryItem } from '../../types/pv';
import {
  Package,
  AlertTriangle,
  Clock,
  Search,
  Plus,
  ArrowRight,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  Filter,
  DollarSign,
  Tag,
  Boxes,
} from 'lucide-react';

interface InventoryDrugManagementProps {
  inventory: DrugInventoryItem[];
  onReplenishStock: (id: string, qty: number, batchNumber: string) => void;
  onUpdatePrice: (id: string, newMrp: number) => void;
}

export const InventoryDrugManagement: React.FC<InventoryDrugManagementProps> = ({
  inventory,
  onReplenishStock,
  onUpdatePrice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItemForReplenish, setSelectedItemForReplenish] = useState<DrugInventoryItem | null>(null);
  const [replenishQty, setReplenishQty] = useState<number>(50);
  const [replenishBatch, setReplenishBatch] = useState<string>('BT26-' + Math.floor(100 + Math.random() * 900));
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState<number>(0);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'low') return item.status === 'Low Stock' || item.status === 'Critical Low';
    if (statusFilter === 'expiring') return item.status === 'Expiring Soon';
    if (statusFilter === 'in_stock') return item.status === 'In Stock';
    return true;
  });

  const getStatusBadge = (status: DrugInventoryItem['status']) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Low Stock':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Critical Low':
        return 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse';
      case 'Expiring Soon':
        return 'bg-purple-100 text-purple-900 border-purple-300';
    }
  };

  const lowStockCount = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Critical Low').length;
  const expiringCount = inventory.filter((i) => i.status === 'Expiring Soon').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Catalog Items</span>
            <span className="text-2xl font-mono font-black text-slate-900">{inventory.length}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Low Stock Warnings</span>
            <span className="text-2xl font-mono font-black text-rose-900">{lowStockCount}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Expiring within 90 Days</span>
            <span className="text-2xl font-mono font-black text-purple-900">{expiringCount}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Generic Substitutions</span>
            <span className="text-2xl font-mono font-black text-emerald-900">
              {inventory.filter((i) => i.genericAlternative).length} Available
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Inventory Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand name, generic molecule, or batch number..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              All Items ({inventory.length})
            </button>
            <button
              onClick={() => setStatusFilter('low')}
              className={`px-3 py-1 rounded-lg ${
                statusFilter === 'low' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setStatusFilter('expiring')}
              className={`px-3 py-1 rounded-lg ${
                statusFilter === 'expiring' ? 'bg-purple-600 text-white shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              Expiring ({expiringCount})
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Medicine & Molecule</th>
                <th className="py-3 px-3">Batch & Expiry</th>
                <th className="py-3 px-3">Stock Level</th>
                <th className="py-3 px-3">Price (MRP / Cost)</th>
                <th className="py-3 px-3">Generic Alternative</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Brand & Generic */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{item.brandName}</span>
                      <span className="text-[10px] font-mono bg-orange-100 text-orange-900 px-1.5 py-0.2 rounded font-bold">
                        {item.strength}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{item.genericName}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Form: {item.dosageForm}</span>
                  </td>

                  {/* Batch & Expiry */}
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-slate-800 block text-xs">
                      {item.batchNumber}
                    </span>
                    <span className={`text-[11px] font-medium flex items-center gap-1 mt-0.5 ${
                      item.status === 'Expiring Soon' ? 'text-purple-700 font-bold' : 'text-slate-500'
                    }`}>
                      <Clock className="w-3 h-3 inline" />
                      Exp: {item.expiryDate}
                    </span>
                  </td>

                  {/* Stock Level & Status */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900">
                        {item.stockQuantity}
                      </span>
                      <span className="text-slate-500 text-[11px]">{item.unit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Min: {item.reorderLevel}</span>
                    </div>
                  </td>

                  {/* Price List */}
                  <td className="py-3.5 px-3">
                    {editingPriceId === item.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          value={priceInput}
                          onChange={(e) => setPriceInput(Number(e.target.value))}
                          className="w-16 px-1.5 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                        />
                        <button
                          onClick={() => {
                            onUpdatePrice(item.id, priceInput);
                            setEditingPriceId(null);
                          }}
                          className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span className="font-mono font-extrabold text-slate-900 text-sm">
                          ₹{item.mrp.toFixed(2)}
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono">Cost: ₹{item.costPrice.toFixed(2)}</p>
                        <button
                          onClick={() => {
                            setEditingPriceId(item.id);
                            setPriceInput(item.mrp);
                          }}
                          className="text-[10px] text-orange-600 hover:underline font-semibold"
                        >
                          Edit Price
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Generic Substitution Suggestion */}
                  <td className="py-3.5 px-3">
                    {item.genericAlternative ? (
                      <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-emerald-950 text-[11px]">
                            {item.genericAlternative.brandName}
                          </span>
                          <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                            Save {item.genericAlternative.savingsPercent}%
                          </span>
                        </div>
                        <p className="text-emerald-800 text-[10px] font-mono">
                          MRP: ₹{item.genericAlternative.mrp.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No alternative recorded</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedItemForReplenish(item);
                        setReplenishBatch('BT26-' + Math.floor(100 + Math.random() * 900));
                      }}
                      className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold border border-orange-200 rounded-xl text-xs transition-all flex items-center gap-1 ml-auto"
                    >
                      <Plus className="w-3.5 h-3.5 text-orange-600" />
                      <span>Replenish Stock</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Replenishment Modal */}
      {selectedItemForReplenish && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Stock Replenishment Request</h4>
                  <p className="text-xs text-slate-500">{selectedItemForReplenish.brandName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItemForReplenish(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Quantity to Add ({selectedItemForReplenish.unit}):
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={replenishQty}
                  onChange={(e) => setReplenishQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Received Lot / Batch Number:
                </label>
                <input
                  type="text"
                  value={replenishBatch}
                  onChange={(e) => setReplenishBatch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-[11px] text-orange-950 space-y-1">
                <span className="font-bold block">Current Stock: {selectedItemForReplenish.stockQuantity} {selectedItemForReplenish.unit}</span>
                <span>New Total: {selectedItemForReplenish.stockQuantity + replenishQty} {selectedItemForReplenish.unit}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedItemForReplenish(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReplenishStock(selectedItemForReplenish.id, replenishQty, replenishBatch);
                  setSelectedItemForReplenish(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
              >
                Confirm Inward Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
