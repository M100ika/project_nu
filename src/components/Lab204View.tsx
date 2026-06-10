import React, { useState, useEffect } from 'react';
import { PowerLoad, AuditLogEntry } from '../types';
import { 
  ChevronRight, 
  Cpu, 
  Waves, 
  Activity, 
  Lock, 
  ShieldAlert, 
  Power, 
  History, 
  Compass, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCw,
  Search,
  Check
} from 'lucide-react';

interface Lab204ViewProps {
  initialLoads: PowerLoad[];
  initialLogs: AuditLogEntry[];
  onCommitLoadShedding: (updatedLoads: PowerLoad[]) => void;
}

export default function Lab204View({ 
  initialLoads, 
  initialLogs, 
  onCommitLoadShedding 
}: Lab204ViewProps) {
  const [loads, setLoads] = useState<PowerLoad[]>(initialLoads);
  const [logs, setLogs] = useState<AuditLogEntry[]>(initialLogs);
  const [logSearch, setLogSearch] = useState('');
  const [customLogText, setCustomLogText] = useState('');
  
  // Wave animation simulation
  const [dynamicWave, setDynamicWave] = useState<number[]>([15, 24, 40, 48, 56, 48, 40, 24, 12, 24, 40, 48, 32]);
  const [occupants, setOccupants] = useState(3);
  const [temperature, setTemperature] = useState(21.4);

  // Micro-interaction simulation for live wave fluctuations
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setDynamicWave(prev => prev.map(() => Math.floor(Math.random() * 55) + 15));
    }, 380);

    // Random temperature drift simulation
    const tempInterval = setInterval(() => {
      setTemperature(prev => {
        const drift = (Math.random() - 0.5) * 0.1;
        return Number((prev + drift).toFixed(1));
      });
    }, 4000);

    return () => {
      clearInterval(waveInterval);
      clearInterval(tempInterval);
    };
  }, []);

  const handleToggleLoad = (id: string) => {
    const updated = loads.map(load => {
      if (load.id === id && !load.isLocked) {
        const nextStatus = !load.status;
        
        // Append log entry dynamically on toggle
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const newLog: AuditLogEntry = {
          id: `dyn-log-${Date.now()}`,
          timestamp,
          type: 'Power Adjustment',
          message: `${load.name} state changed to ${nextStatus ? 'ENABLED' : 'SHED/DISABLED'} by SafeSpace terminal console.`
        };
        
        setLogs(prev => [newLog, ...prev]);
        return { ...load, status: nextStatus };
      }
      return load;
    });
    setLoads(updated);
  };

  const handleCommit = () => {
    onCommitLoadShedding(loads);
    
    // Add commitment audit log
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newLog: AuditLogEntry = {
      id: `dyn-log-${Date.now()}`,
      timestamp,
      type: 'Policy Update',
      message: 'Committed state of white-listed loads to regional safety controller.'
    };
    setLogs(prev => [newLog, ...prev]);
    alert("Load shedding policy synchronized with hardware controllers successfully!");
  };

  const handleAddCustomLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLogText.trim()) return;

    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newEntry: AuditLogEntry = {
      id: `custom-log-${Date.now()}`,
      timestamp,
      type: 'Operator Notice',
      message: customLogText.trim()
    };

    setLogs(prev => [newEntry, ...prev]);
    setCustomLogText('');
  };

  // Filter logs based on search
  const filteredLogs = logs.filter(log => 
    log.type.toLowerCase().includes(logSearch.toLowerCase()) || 
    log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.timestamp.includes(logSearch)
  );

  return (
    <div id="lab-204-view-root" className="space-y-6">
      
      {/* Breadcrumb & Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <nav className="flex items-center gap-1.5 text-white/40 mb-2">
            <span className="font-bold text-[10px] tracking-wider uppercase text-white/50">FACILITIES</span>
            <ChevronRight className="h-3 w-3 text-white/30" />
            <span className="font-bold text-[10px] tracking-wider uppercase text-white/50">NORTH WING</span>
            <ChevronRight className="h-3 w-3 text-white/30" />
            <span className="font-bold text-[10px] tracking-wider uppercase text-cyan-400">LAB 204</span>
          </nav>
          <h1 id="lab-204-title" className="text-3xl font-black tracking-tight text-white">Lab 204: Quantum Photonics</h1>
        </div>

        {/* System nominal pill state */}
        <div id="system-status-indicator" className="flex items-center gap-2.5 bg-white/5 rounded-2xl p-2.5 border border-white/10 shadow-lg">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
          <span className="font-bold text-[10px] text-white/60 uppercase tracking-widest">SYSTEM NOMINAL</span>
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <span className="font-mono text-sm font-bold text-white">{temperature}°C</span>
        </div>
      </div>

      {/* Split View Layout of Telemetry and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Occupancy CSI Waves and Privacy Protocols */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
            {/* Top primary bar indicator */}
            <div className="h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 w-full" />
            
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Waves className="text-cyan-400 h-5 w-5" />
                <h2 className="text-base font-bold text-white">WiFi-CSI Occupancy Stream</h2>
              </div>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">REAL-TIME TELEMETRY</span>
            </div>

            {/* Simulated Dot-Grid Web Component display */}
            <div id="telemetry-canvas" className="p-6 relative h-80 flex items-center justify-center overflow-hidden bg-[#030712]/40 border-b border-white/5">
              {/* Dynamic pulse visualization bar chart */}
              <div className="w-full h-full flex items-center justify-around gap-1.5 max-w-sm px-6 relative z-10">
                {dynamicWave.map((h, i) => (
                  <div 
                    key={i}
                    className="w-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all"
                    style={{ 
                      height: `${h}%`,
                      transition: 'height 0.38s ease-in-out',
                      opacity: i === 0 || i === dynamicWave.length - 1 ? 0.25 : i === 1 || i === dynamicWave.length - 2 ? 0.45 : 0.85
                    }}
                  />
                ))}
              </div>

              {/* Occupants badge superimposed */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <span className="text-[88px] font-black text-white/5 select-none font-sans tracking-tighter">
                  {occupants}
                </span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] -mt-4">
                  DETECTED OCCUPANTS
                </span>
                {/* Visual support tags */}
                <div className="flex gap-2.5 mt-3">
                  <button 
                    onClick={() => setOccupants(prev => Math.max(0, prev - 1))}
                    className="pointer-events-auto w-7 h-7 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-sm text-white font-bold hover:bg-white/20 hover:text-cyan-300 cursor-pointer shadow-md transition-all active:scale-90"
                    title="Simulate Person leaving"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => setOccupants(prev => prev + 1)}
                    className="pointer-events-auto w-7 h-7 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-sm text-white font-bold hover:bg-white/20 hover:text-cyan-300 cursor-pointer shadow-md transition-all active:scale-90"
                    title="Simulate Person entry"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Signal Strengths statistics */}
            <div className="p-4 bg-white/5 border-t border-white/5 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[9px] font-bold text-white/40 uppercase mb-0.5">SIGNAL STRENGTH</p>
                <p className="font-mono text-sm font-bold text-white">-42 dBm</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-white/40 uppercase mb-0.5">INTERFERENCE</p>
                <p className="font-mono text-sm font-bold text-cyan-400">LOW</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-white/40 uppercase mb-0.5">STABILITY</p>
                <p className="font-mono text-sm font-bold text-emerald-400">99.8%</p>
              </div>
            </div>
          </section>

          {/* Activity Metrics and Privacy Protocol column widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <article className="bg-white/5 border border-white/10 p-4.5 rounded-2xl shadow-lg backdrop-blur-3xl">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="text-cyan-400 h-4.5 w-4.5" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Activity Metrics</h3>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-white/60">Sustained Motion</span>
                    <span className="font-mono font-bold text-cyan-400">High</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full w-[85%] shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-white/60">Thermal Signature</span>
                    <span className="font-mono font-bold text-white/80">Normal</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white/30 h-full w-[40%]" />
                  </div>
                </div>
              </div>
            </article>

            <article className="bg-white/5 border border-white/10 p-4.5 rounded-2xl shadow-lg backdrop-blur-3xl">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="text-[#a855f7] h-4.5 w-4.5" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Privacy Protocol</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed mb-3">
                CSI sensing ensures 0% optical visual capture. Occupant identity is anonymized via hardware-level crypto hashes.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 fill-emerald-500/10" />
                <span className="text-[10px] font-mono font-bold tracking-wider">AES-256 SECURED ACTIVE</span>
              </div>
            </article>

          </div>
        </div>

        {/* Right Hand Side: Power Management and Logs */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
            <div className="h-1 bg-white/20 w-full" />
            
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-2">
                <Cpu className="text-pink-400 h-5 w-5" />
                <h2 className="text-base font-bold text-white">Power Management</h2>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-400/25">3.82 kW</span>
            </div>

            <div className="p-4 space-y-4">
              {/* Critical Loads Block */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Lock className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                    CRITICAL LOADS (SYSTEM LOCKED)
                  </span>
                </div>
                
                <div className="space-y-1.5">
                  {loads.filter(l => l.type === 'critical').map(load => (
                    <div key={load.id} className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl">
                      <span className="text-xs font-medium text-white/80">{load.name}</span>
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 fill-emerald-500/10" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/15" />

              {/* Managed/Whitelisted loads with toggles */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <RotateCw className="h-3.5 w-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">
                    WHITE-LISTED LOADS
                  </span>
                </div>

                <div className="space-y-1.5">
                  {loads.filter(l => l.type === 'whitelist').map(load => (
                    <label 
                      key={load.id} 
                      className="flex items-center justify-between p-2.5 border border-white/5 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all duration-200"
                    >
                      <span className="text-xs text-white/80 font-medium">{load.name}</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={load.status}
                          onChange={() => handleToggleLoad(load.id)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-white/10 peer-checked:bg-cyan-500 rounded-full transition-all peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all shadow-inner" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action sync button */}
              <button 
                id="commit-load-shedding-btn"
                onClick={handleCommit}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-extrabold text-xs tracking-wider rounded-xl hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                COMMIT LOAD SHEDDING CONFIGURATION
              </button>
            </div>
          </section>

          {/* System Audit Log Module */}
          <section className="bg-white/5 border border-white/10 rounded-2xl flex flex-col h-[380px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-2">
                <History className="text-cyan-400 h-5 w-5" />
                <h2 className="text-base font-bold text-white">System Audit Log</h2>
              </div>
              
              <div className="relative max-w-[140px]">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/30" />
                <input
                  id="audit-log-search-input"
                  type="text"
                  placeholder="Filter logs..."
                  className="pl-8 pr-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-400 text-white font-sans placeholder-white/30"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Scrolling log list */}
            <div id="audit-log-scroll-area" className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3.5">
              {filteredLogs.map(log => (
                <div key={log.id} className="flex gap-3 text-xs leading-relaxed border-b border-white/5 pb-2.5 last:border-b-0">
                  <div className="font-mono text-[10px] text-white/40 pt-0.5 whitespace-nowrap tracking-wider">
                    {log.timestamp}
                  </div>
                  <div>
                    <p className={`font-semibold ${log.isAlert ? 'text-red-400' : 'text-cyan-300'}`}>
                      {log.type}
                    </p>
                    <p className="text-white/70 font-medium">
                      {log.message}
                    </p>
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="text-center py-10 text-white/30 text-xs font-mono">
                  No matching log events.
                </div>
              )}
            </div>

            {/* Operator Entry Console Input */}
            <form onSubmit={handleAddCustomLog} className="border-t border-white/10 p-2.5 bg-slate-900/60 flex gap-2">
              <input
                id="audit-custom-entry-input"
                type="text"
                placeholder="Message logger node..."
                value={customLogText}
                onChange={(e) => setCustomLogText(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 placeholder-white/20"
              />
              <button
                id="add-audit-log-btn"
                type="submit"
                className="px-4.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-xl text-xs font-extrabold tracking-wider transition-all"
              >
                LOG
              </button>
            </form>
          </section>
        </div>

      </div>

    </div>
  );;
}
