import React, { useState } from 'react';
import { FleetNode } from '../types';
import { 
  Plus, 
  RefreshCw, 
  SlidersHorizontal,
  Wifi, 
  Battery, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  MoreVertical,
  Sliders,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface DevicesViewProps {
  initialNodes: FleetNode[];
  onAddNewNode: (node: FleetNode) => void;
  onBulkSync: () => void;
}

export default function DevicesView({ 
  initialNodes, 
  onAddNewNode, 
  onBulkSync 
}: DevicesViewProps) {
  const [nodes, setNodes] = useState<FleetNode[]>(initialNodes);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  
  // Dialog state for registering new nodes
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [newNodeId, setNewNodeId] = useState('');
  const [newNodeLocation, setNewNodeLocation] = useState('');
  const [newNodeZone, setNewNodeZone] = useState('North Wing');
  const [newNodeBattery, setNewNodeBattery] = useState(100);

  // Filters State
  const [statusFilter, setStatusFilter] = useState<'all' | 'low_battery' | 'offline'>('all');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const zones = ['All', 'North Wing', 'Data Center B', 'Executive Suites'];

  // Handle individual row checking
  const handleToggleSelectRow = (id: string) => {
    const updated = new Set(selectedNodeIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedNodeIds(updated);
  };

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedNodeIds(new Set(filteredNodes.map(n => n.id)));
    } else {
      setSelectedNodeIds(new Set());
    }
  };

  // Reset Filters functionality
  const handleResetFilters = () => {
    setStatusFilter('all');
    setZoneFilter('All');
    setSearchQuery('');
  };

  const handleProvisionNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeId.trim() || !newNodeLocation.trim()) {
      alert("Please provide complete Node registration information.");
      return;
    }

    const createdNode: FleetNode = {
      id: newNodeId.trim().toUpperCase(),
      location: newNodeLocation.trim(),
      zone: newNodeZone,
      battery: Number(newNodeBattery),
      signalBars: Math.floor(Math.random() * 3) + 2, // 2-4 randomly
      firmware: 'v2.4.0',
      calibration: 'Calibrated',
      status: Number(newNodeBattery) <= 15 ? 'low_battery' : 'online'
    };

    onAddNewNode(createdNode);
    setNodes(prev => [createdNode, ...prev]);
    setIsProvisioning(false);
    
    // Clear forms
    setNewNodeId('');
    setNewNodeLocation('');
    setNewNodeBattery(100);
    alert(`Node ${createdNode.id} provisioned and paired successfully parameters.`);
  };

  // Node triggers
  const handleBulkUpdateFirmware = () => {
    if (selectedNodeIds.size === 0) {
      alert("Please select at least one node checkbox from the grid to push firmware over-the-air.");
      return;
    }
    setNodes(prev => prev.map(node => {
      if (selectedNodeIds.has(node.id)) {
        return { ...node, firmware: 'v2.4.1-rc' };
      }
      return node;
    }));
    alert(`OTA Firmware push initiated for ${selectedNodeIds.size} nodes. Upgraded target nodes successfully.`);
    setSelectedNodeIds(new Set());
  };

  // Filter application pipeline
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          node.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = zoneFilter === 'All' || node.zone === zoneFilter;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'low_battery' && node.status === 'low_battery') ||
                          (statusFilter === 'offline' && node.status === 'offline');
    return matchesSearch && matchesZone && matchesStatus;
  });

  const batteryCriticalCount = nodes.filter(n => n.battery <= 15).length;
  const updateBacklogCount = nodes.filter(n => n.firmware !== 'v2.4.1-rc').length;

  return (
    <div id="devices-view-root" className="space-y-6">
      
      {/* Header and Action Tools */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 id="devices-view-title" className="text-3xl font-extrabold tracking-tight text-gray-950">Hardware Fleet</h1>
          <p className="text-gray-500 text-sm mt-0.5">Managing {nodes.length} ESP32-S3 sensor nodes across 12 campus partitions.</p>
        </div>
        
        <div className="flex gap-2.5 shrink-0">
          <button 
            id="bulk-update-firmware-btn"
            onClick={handleBulkUpdateFirmware}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
            BULK UPDATE FIRMWARE
          </button>
          
          <button 
            id="provision-node-btn"
            onClick={() => setIsProvisioning(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-black/90 text-white rounded-lg text-xs font-bold active:scale-95 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            PROVISION NODE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5 shadow-xs">
            
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Filters</h2>
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            </div>

            {/* Quick search input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                id="nodes-search-input"
                type="text"
                placeholder="Search nodes ID/location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Radio / Status Buttons */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                DEVICE STATUS
              </label>
              
              <div className="space-y-1">
                <button
                  id="status-filter-all"
                  onClick={() => setStatusFilter('all')}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex justify-between items-center transition-all ${
                    statusFilter === 'all' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>All Nodes</span>
                  <span className="font-mono text-[10px]">{nodes.length}</span>
                </button>

                <button
                  id="status-filter-low-battery"
                  onClick={() => setStatusFilter('low_battery')}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex justify-between items-center transition-all ${
                    statusFilter === 'low_battery' ? 'bg-red-50 text-red-700 border border-red-200/50' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>Low Battery (≤15%)</span>
                  <span className="font-mono text-[10px] text-red-600 font-bold">{batteryCriticalCount}</span>
                </button>

                <button
                  id="status-filter-offline"
                  onClick={() => setStatusFilter('offline')}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex justify-between items-center transition-all ${
                    statusFilter === 'offline' ? 'bg-slate-100 text-slate-800' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>Offline</span>
                  <span className="font-mono text-[10px] text-slate-500 font-bold">
                    {nodes.filter(n => n.status === 'offline').length}
                  </span>
                </button>
              </div>
            </div>

            {/* Zone dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                LOCATION ZONE
              </label>
              
              <select 
                id="zone-select-filter"
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded p-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
              >
                {zones.map(z => (
                  <option key={z} value={z}>{z === 'All' ? 'All Zones' : z}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters bar */}
            <div className="pt-4 border-t border-gray-200/80">
              <button 
                id="reset-filters-btn"
                onClick={handleResetFilters}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 hover:text-black rounded text-[10px] uppercase font-bold tracking-wider text-gray-500 active:scale-95 transition-all text-center block"
              >
                Reset Filters
              </button>
            </div>

          </div>
        </aside>

        {/* Tabular data stream */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleToggleSelectAll}
                        checked={filteredNodes.length > 0 && selectedNodeIds.size === filteredNodes.length}
                        className="rounded-xs border-gray-300 text-black focus:ring-black h-3.5 w-3.5"
                      />
                    </th>
                    <th className="p-4">Node ID</th>
                    <th className="p-4">Location</th>
                    <th className="p-4 text-center">Battery</th>
                    <th className="p-4 text-center">Signal</th>
                    <th className="p-4">Firmware</th>
                    <th className="p-4">Calibration</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs text-gray-700">
                  {filteredNodes.map((node) => {
                    const isSelected = selectedNodeIds.has(node.id);
                    const isLow = node.battery <= 15;
                    const isOffline = node.status === 'offline';
                    
                    return (
                      <tr 
                        id={`node-row-${node.id}`}
                        key={node.id} 
                        className={`hover:bg-gray-50/50 transition-colors ${
                          isSelected ? 'bg-black/[0.02]' : ''
                        }`}
                      >
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(node.id)}
                            className="rounded-xs border-gray-300 text-black focus:ring-black h-3.5 w-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full block shrink-0 ${
                              isOffline 
                                ? 'bg-slate-400' 
                                : isLow 
                                  ? 'bg-red-500 animate-pulse' 
                                  : 'bg-emerald-500'
                            }`} />
                            <span className="font-mono font-bold text-gray-950">{node.id}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-600">{node.location}</td>
                        
                        {/* Battery representation */}
                        <td className="p-4">
                          <div className="flex flex-col items-center justify-center gap-1 min-w-[70px]">
                            {/* Proportional custom power slots */}
                            <div className="flex gap-[1.5px]">
                              <div className={`w-3.5 h-1.5 rounded-2xs ${node.battery > 0 ? (isLow ? 'bg-red-500' : 'bg-black') : 'bg-gray-200'}`} />
                              <div className={`w-3.5 h-1.5 rounded-2xs ${node.battery >= 25 ? 'bg-black' : 'bg-gray-200'}`} />
                              <div className={`w-3.5 h-1.5 rounded-2xs ${node.battery >= 60 ? 'bg-black' : 'bg-gray-200'}`} />
                              <div className={`w-3.5 h-1.5 rounded-2xs ${node.battery >= 85 ? 'bg-black' : 'bg-gray-200'}`} />
                            </div>
                            <span className={`font-mono text-[10px] font-bold ${isLow ? 'text-red-500' : 'text-gray-500'}`}>
                              {node.battery}%
                            </span>
                          </div>
                        </td>

                        {/* Signal bars */}
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-end gap-[2px] h-4">
                            <div className={`w-1 h-1.5 rounded-xs ${node.signalBars >= 1 ? 'bg-black' : 'bg-gray-200'}`} />
                            <div className={`w-1 h-2 rounded-xs ${node.signalBars >= 2 ? 'bg-black' : 'bg-gray-200'}`} />
                            <div className={`w-1 h-3 rounded-xs ${node.signalBars >= 3 ? 'bg-black' : 'bg-gray-200'}`} />
                            <div className={`w-1 h-4 rounded-xs ${node.signalBars >= 4 ? 'bg-black' : 'bg-gray-200'}`} />
                          </div>
                        </td>

                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            node.firmware === 'v2.4.1-rc' 
                              ? 'bg-slate-100 text-slate-800 border-slate-200' 
                              : 'bg-gray-50/80 text-gray-500 border-gray-100'
                          }`}>
                            {node.firmware}
                          </span>
                        </td>

                        <td className="p-4 font-medium">
                          {node.calibration === 'Needs Drift Correction' ? (
                            <span className="flex items-center gap-1 text-red-500 font-bold text-[10px] uppercase">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                              Needs Drift
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-emerald-700">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              Calibrated
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <button 
                            id={`node-actions-trigger-${node.id}`}
                            onClick={() => {
                              const calibrated = node.calibration === 'Calibrated';
                              alert(`Node context configured.\nID: ${node.id}\nFirmware: ${node.firmware}\nBattery Index: ${node.battery}%\nStatus: ${node.status.toUpperCase()}`);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-black transition-colors shrink-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredNodes.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">
                        No hardware nodes found active in selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls bar */}
            <div className="flex items-center justify-between p-4 bg-gray-50/50 border-t border-gray-200/80">
              <span className="text-xs font-medium text-gray-500">
                Showing {filteredNodes.length > 0 ? '1' : '0'} to {filteredNodes.length} of {nodes.length} nodes
              </span>
              <div className="flex gap-2">
                <button 
                  id="pagination-prev"
                  className="px-3 py-1.5 border border-gray-300 rounded text-[11px] font-bold tracking-wider hover:bg-gray-50 active:scale-95 transition-all text-gray-600 disabled:opacity-40" 
                  disabled
                >
                  PREVIOUS
                </button>
                <button 
                  id="pagination-next"
                  onClick={() => alert("Loading page 2 of sensor topology indexes...")}
                  className="px-3 py-1.5 border border-gray-300 rounded text-[11px] font-bold tracking-wider hover:bg-gray-50 active:scale-95 transition-all text-gray-600"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>

          {/* Institutional Health Indicators Bottom section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-3xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Network Health</span>
                <Wifi className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-1 text-gray-950 font-bold">
                <span className="text-xl">98.2%</span>
                <span className="text-[10px] text-emerald-600 font-mono">+0.4%</span>
              </div>
              {/* Progress health index */}
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-emerald-500 h-full w-[98%]" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-3xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Battery Alerts</span>
                <Battery className="h-4 w-4 text-amber-500 animate-pulse" />
              </div>
              <div className="flex items-baseline gap-1 text-gray-950 font-bold">
                <span className="text-xl">{batteryCriticalCount}</span>
                <span className="text-[10px] text-red-500 font-mono">High Priority</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-medium">Lithium physical sync suggested within 48h.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-3xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Update Backlog</span>
                <Cpu className="h-4 w-4 text-red-500" />
              </div>
              <div className="flex items-baseline gap-1 text-gray-950 font-bold">
                <span className="text-xl">{updateBacklogCount}</span>
                <span className="text-[10px] text-gray-400 font-mono">Nodes Pending</span>
              </div>
              <button 
                id="nodes-sync-btn"
                onClick={onBulkSync}
                className="text-[10px] font-bold text-black underline mt-2 block active:scale-95 transform cursor-pointer text-left uppercase tracking-wider"
              >
                START SYNC
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Provisioning Dialogue Modal */}
      {isProvisioning && (
        <div id="provisioning-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-55 p-4 animate-fade-in">
          <div className="bg-white rounded-xl border border-gray-300 w-full max-w-md overflow-hidden shadow-xl animate-scale-up">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900">Provision SafeSpace Node</h3>
              <button 
                onClick={() => setIsProvisioning(false)}
                className="text-gray-400 hover:text-black font-extrabold text-sm"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleProvisionNodeSubmit} className="p-5 space-y-4 text-left">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  NODE ID / CHIP ADDRESS
                </label>
                <input
                  id="provision-node-id-input"
                  type="text"
                  required
                  placeholder="e.g. ESP32-S3-A29F"
                  value={newNodeId}
                  onChange={(e) => setNewNodeId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Location Placement
                </label>
                <input
                  id="provision-node-loc-input"
                  type="text"
                  required
                  placeholder="e.g. West Wing Lab Desk 4"
                  value={newNodeLocation}
                  onChange={(e) => setNewNodeLocation(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    ZONE DIVISION
                  </label>
                  <select
                    id="provision-node-zone-select"
                    value={newNodeZone}
                    onChange={(e) => setNewNodeZone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded focus:outline-none"
                  >
                    <option value="North Wing">North Wing</option>
                    <option value="Data Center B">Data Center B</option>
                    <option value="Executive Suites">Executive Suites</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    BATTERY CHARGE (%)
                  </label>
                  <input
                    id="provision-node-battery-input"
                    type="number"
                    min="1"
                    max="100"
                    value={newNodeBattery}
                    onChange={(e) => setNewNodeBattery(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsProvisioning(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                >
                  CANCEL
                </button>
                <button
                  id="submit-provision-btn"
                  type="submit"
                  className="px-4 py-2 bg-black hover:bg-black/90 text-white rounded shadow-xs"
                >
                  PROVISION PAIRING
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
