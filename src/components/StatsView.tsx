import React, { useState } from 'react';
import { ForgottenDevice } from '../types';
import { 
  FileDown, 
  RotateCw, 
  TrendingUp, 
  Leaf, 
  CheckCircle, 
  ChevronDown, 
  AlertOctagon, 
  Power,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

interface StatsViewProps {
  initialForgottenDevices: ForgottenDevice[];
}

export default function StatsView({ initialForgottenDevices }: StatsViewProps) {
  const [devices, setDevices] = useState<ForgottenDevice[]>(initialForgottenDevices);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [monthlySavings, setMonthlySavings] = useState(4822.40);
  const [selectedZoneInfo, setSelectedZoneInfo] = useState<string>("Zone 3 (Cafeteria) shows consistent peak usage during off-hours. Audit recommended.");
  const [selectedHeatIndex, setSelectedHeatIndex] = useState<number | null>(2); // Default to cafeteria (index 2)

  const handleShutdownDevice = (id: string) => {
    // Shutdown transition
    setDevices(prev => prev.map(dev => {
      if (dev.id === id) {
        return { ...dev, isShutdown: true };
      }
      return dev;
    }));

    // Trigger feedback log
    const dev = devices.find(d => d.id === id);
    if (dev) {
      // Increase fake monthly savings by the relative leakage calculation
      setMonthlySavings(prev => prev + dev.costImpact * 24 * 30);
    }
  };

  const handleBulkShutdown = () => {
    if (window.confirm('Confirm bulk power-down of all idle devices? This will send remote shutdown signals to all active leakage units.')) {
      setIsBulkProcessing(true);
      setTimeout(() => {
        setDevices(prev => prev.map(dev => ({ ...dev, isShutdown: true })));
        setIsBulkProcessing(false);
        setMonthlySavings(prev => prev + 120.40); // Standard calculated mitigation savings
        alert('Bulk shutdown command dispatched successfully. Energy leakage mitigated portfolio-wide.');
      }, 1200);
    }
  };

  // Heatmap configuration blocks
  const heatmapData = [
    { name: "Server Room A", label: "Low Usage", level: 1 }, 
    { name: "Floor 1 Reception", label: "Moderate Usage", level: 4 },
    { name: "Cafeteria", label: "Peak Usage", level: 9 },
    { name: "Lobby Front", label: "Low Usage", level: 2 },

    { name: "Lab 204", label: "High Usage", level: 6 },
    { name: "Research Room C", label: "Low Usage", level: 1 },
    { name: "Library", label: "Moderate Usage", level: 3 },
    { name: "Admin Annex", label: "High Usage", level: 5 },

    { name: "Mechanical Yard", label: "Heavy load", level: 8 },
    { name: "Gymnasium", label: "Low Usage", level: 1 },
    { name: "Office 302", label: "Moderate Usage", level: 4 },
    { name: "IT Helpdesk", label: "Low Usage", level: 2 },

    { name: "Lab 205 (Failover)", label: "Heavy load", level: 9 },
    { name: "Lecture Hall 101", label: "Moderate Usage", level: 3 },
    { name: "Executive Suite", label: "Low Usage", level: 1 },
    { name: "Data Center Room", label: "High Usage", level: 6 }
  ];

  const getHeatmapColor = (level: number) => {
    if (level <= 2) return "bg-black/10 hover:bg-black/20";
    if (level <= 4) return "bg-black/35 hover:bg-black/45";
    if (level <= 6) return "bg-black/60 hover:bg-black/70";
    return "bg-black/90 hover:bg-black/100";
  };

  const handleHeatmapClick = (index: number) => {
    setSelectedHeatIndex(index);
    const cell = heatmapData[index];
    setSelectedZoneInfo(`"${cell.name} (${cell.label}) is currently operating at level ${cell.level}/10 load efficiency. Automated telemetry nominal."`);
  };

  const currentLeakageSum = devices.reduce((acc, d) => !d.isShutdown ? acc + d.costImpact : acc, 0);

  return (
    <div id="stats-view-root" className="space-y-6">
      
      {/* Hero Header with quick PDF/Scan functions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 id="stats-view-title" className="text-3xl font-black tracking-tight text-white">Energy ROI Audit</h1>
          <p className="text-white/60 text-sm mt-0.5">Operational performance, carbon footprint and fiscal impact analysis for current quarter.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            id="export-report-btn"
            onClick={() => alert("Downloading PDF Energy ROI Audit Report (SAF-2023-09-ROI)...")}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white active:scale-95 transition-all shadow-md"
          >
            <FileDown className="h-4 w-4 text-cyan-400" />
            EXPORT REPORT
          </button>
          <button 
            id="re-scan-btn"
            onClick={() => alert("Initiating ultrasonic thermal and power telemetry sweep across 12 zones...")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-xl text-xs font-extrabold active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] h-9"
          >
            <RotateCw className="h-4 w-4" />
            RE-SCAN SYSTEM
          </button>
        </div>
      </div>

      {/* Bento Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Monthly Net Savings */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl relative overflow-hidden group">
          {/* Top primary bar indicator */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 to-indigo-500" />
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Net Savings (Monthly)</p>
              <h3 className="text-2xl font-black text-white mt-1">
                ${monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg text-xs font-mono font-bold border border-emerald-500/20 animate-pulse">
              <TrendingUp className="h-3.5 w-3.5" />
              +12.4%
            </div>
          </div>

          {/* Simple CSS-rendered bar visualization */}
          <div className="h-10 w-full flex items-end gap-1.5 pt-1.5">
            <div className="flex-1 bg-white/10 h-4 rounded-md" />
            <div className="flex-1 bg-white/15 h-6 rounded-md" />
            <div className="flex-1 bg-white/20 h-7 rounded-md" />
            <div className="flex-1 bg-cyan-400/45 h-8 rounded-md" />
            <div className="flex-1 bg-cyan-400/75 h-9 rounded-md shadow-[0_0_6px_rgba(34,211,238,0.3)]" />
            <div className="flex-1 bg-cyan-400 h-10 rounded-md shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
            <div className="flex-1 bg-white/30 h-8 rounded-md" />
          </div>
        </div>

        {/* Total saved kilowatts */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-400" />
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Total Saved</p>
          <h3 className="text-2xl font-black text-white mt-1 font-mono">12,402 kWh</h3>
          
          <div className="mt-4 flex items-center gap-1.5 text-xs text-white/60">
            <Leaf className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white/80"><span className="text-emerald-400 font-bold">4.2 Metric Tons</span> CO₂</span>
          </div>
        </div>

        {/* Dynamic System configuration index */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500" />
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">System Health</p>
          <h3 className="text-2xl font-black text-white mt-1 font-mono">98.2%</h3>
          
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-400 fill-emerald-500/10" />
            <span className="font-bold">Optimal Hardware Nominal</span>
          </div>
        </div>

      </div>

      {/* Main Analytics: performance SVG and usage Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Performance savings trend chart */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-base font-bold text-white">Performance Trend</h4>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/80 cursor-pointer hover:bg-white/10 transition-all">
              <span>Last 6 Months</span>
              <ChevronDown className="h-3.5 w-3.5 text-white/40" />
            </div>
          </div>

          {/* SVG Line representation of Savings Trend */}
          <div className="flex-grow h-48 relative flex items-end justify-between px-2.5 pb-2 border border-white/5 rounded-xl bg-slate-950/20">
            <svg className="absolute inset-0 w-full h-full px-4 overflow-visible" preserveAspectRatio="none">
              {/* Baseline Usage dotted stroke */}
              <path 
                d="M 10 140 Q 120 125, 230 135 T 455 110 T 670 120" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.25)" 
                strokeDasharray="4 3" 
                strokeWidth="1.5" 
              />
              {/* Current Savings line dark */}
              <path 
                d="M 10 130 Q 120 100, 230 90 T 455 55 T 670 30" 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="3" 
                filter="drop-shadow(0 0 4px rgba(34,211,238,0.5))"
              />
              
              {/* Data points */}
              <circle cx="10" cy="130" r="3" fill="#22d3ee" className="shadow-lg" />
              <circle cx="230" cy="90" r="3" fill="#22d3ee" className="shadow-lg" />
              <circle cx="455" cy="55" r="3.5" fill="#22d3ee" className="shadow-lg" />
              <circle cx="670" cy="30" r="4.5" fill="#22d3ee" className="shadow-xl" />
            </svg>

            {/* Simulated X-Axis Months labels */}
            <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] font-mono font-bold text-white/30">
              <span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span>
            </div>
          </div>

          <div className="mt-8 flex gap-5">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="w-5 h-0.5 bg-cyan-400 block shadow-[0_0_6px_#22d3ee]" />
              <span className="font-bold">Current Savings Trend</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="w-5 h-0.5 border-t border-dashed border-white/20 block" />
              <span className="font-bold">Baseline Projections</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Heatmap Zone Grid */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
          <h4 className="text-base font-bold text-white mb-3">Usage by Zone</h4>
          <p className="text-xs text-white/50 mb-4">Click any color cell below to view thermal efficiency indices.</p>

          <div className="grid grid-cols-4 gap-2">
            {heatmapData.map((data, index) => {
              const isActive = selectedHeatIndex === index;
              return (
                <div 
                  id={`heatmap-cell-${index}`}
                  key={index}
                  onClick={() => handleHeatmapClick(index)}
                  className={`aspect-square rounded-lg cursor-pointer transition-all duration-150 relative ${
                    data.level <= 2
                      ? "bg-cyan-950/25 hover:bg-cyan-950/45 border border-cyan-500/10"
                      : data.level <= 4
                        ? "bg-cyan-900/40 hover:bg-cyan-900/60 border border-cyan-400/20"
                        : data.level <= 6
                          ? "bg-cyan-500/50 hover:bg-cyan-500/70 border border-cyan-400/30 shadow-[inset_0_0_6px_rgba(34,211,238,0.4)]"
                          : "bg-gradient-to-tr from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                  } ${
                    isActive ? 'ring-2 ring-emerald-400 scale-102 z-20 shadow-[0_0_12px_#34d399]' : ''
                  }`}
                  title={`${data.name}: ${data.label}`}
                >
                  {isActive && (
                    <div className="absolute right-1 bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Gradients guide legend */}
          <div className="mt-4 flex justify-between text-[11px] font-bold text-white/50">
            <span>Efficient</span>
            <div className="flex-grow mx-3 h-2 bg-gradient-to-r from-cyan-950/40 via-cyan-500/40 to-cyan-400 rounded-full self-center" />
            <span>Heavy load</span>
          </div>

          {/* Dynamic contextual advice card */}
          <div className="mt-5 p-3.5 bg-white/5 border border-white/5 rounded-xl">
            <p className="text-xs italic text-cyan-300 font-medium leading-relaxed">
              {selectedZoneInfo}
            </p>
          </div>
        </div>

      </div>

      {/* Forgotten devices leakage board */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="text-red-400 h-5 w-5 animate-pulse" />
            <div>
              <h4 id="leakage-board-title" className="text-base font-bold text-white">Forgotten Devices (Thermal Leakage)</h4>
              <p className="text-xs text-white/40">Idle devices drawing parasitic loads behind building hours.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            {currentLeakageSum > 0 && (
              <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-1">
                Active Leakage: ${currentLeakageSum.toFixed(2)}/hr
              </span>
            )}
            <button 
              id="bulk-shutdown-btn"
              onClick={handleBulkShutdown}
              disabled={isBulkProcessing || devices.every(d => d.isShutdown)}
              className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 disabled:from-white/5 disabled:to-white/5 disabled:border-white/5 text-white disabled:text-white/20 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-[0_0_12px_rgba(239,68,68,0.2)] disabled:shadow-none h-9"
            >
              {isBulkProcessing ? 'SHUTTING DOWN...' : `BULK SHUTDOWN (${devices.filter(d => !d.isShutdown).length})`}
            </button>
          </div>
        </div>

        {/* Leakage table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/20 text-[10px] font-bold text-white/40 uppercase tracking-wider border-b border-white/10">
                <th className="px-6 py-3.5">Device Name</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Idle Since</th>
                <th className="px-6 py-3.5">Cost Impact</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white/70">
              {devices.map(device => {
                return (
                  <tr 
                    id={`device-row-${device.id}`}
                    key={device.id} 
                    className={`hover:bg-white/5 transition-colors ${device.isShutdown ? 'opacity-40 line-through' : ''}`}
                  >
                    <td className="px-6 py-4 font-bold text-white">{device.name}</td>
                    <td className="px-6 py-4 text-white/60">{device.location}</td>
                    <td className="px-6 py-4 text-white/40 font-mono font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        {device.idleSince}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-red-400">
                      {device.isShutdown ? '$0.00/hr' : `$${device.costImpact.toFixed(2)}/hr`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {device.isShutdown ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/25">
                          SHUTDOWN SUCCESSFUL
                        </span>
                      ) : (
                        <button
                          id={`device-power-btn-${device.id}`}
                          onClick={() => handleShutdownDevice(device.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-white rounded-lg border border-red-500/20 transition-all shadow-sm active:scale-90"
                          title="Power down individual device"
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit report meta footnotes */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-white/10 text-white/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 border border-white/5 flex items-center justify-center rounded-xl">
            <FileText className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white/60">Report ID: SAF-2023-09-ROI</p>
            <p className="font-medium text-white/40">Audit Generation: Oct 12, 2023 | 09:44 AM</p>
          </div>
        </div>
        <div className="text-xs md:text-right flex flex-col justify-center">
          <p className="font-bold text-white/60">Audit Digital Signature: 0x82f9c3B92</p>
          <p className="font-medium text-white/40">Data Privacy Level: Enterprise Class High Visibility (Crypto Anonymized)</p>
        </div>
      </footer>

    </div>
  );
}
