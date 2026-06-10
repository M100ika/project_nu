import React, { useState, useEffect } from 'react';
import { Room, LiveIncident } from '../types';
import { 
  Shield, 
  Search, 
  Tv, 
  Activity, 
  AlertTriangle, 
  Flame, 
  Zap, 
  Wifi, 
  MoreVertical, 
  CornerRightDown,
  Maximize2,
  Bell,
  HelpCircle
} from 'lucide-react';

interface DashboardViewProps {
  rooms: Room[];
  incidents: LiveIncident[];
  onNavigateToRoom: (roomId: string) => void;
  onNotifyOfficer: (incidentId: string) => void;
}

export default function DashboardView({ 
  rooms, 
  incidents, 
  onNavigateToRoom, 
  onNotifyOfficer 
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [pulseHeights, setPulseHeights] = useState<number[]>(
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 60) + 20)
  );

  // Filter departments for bento selection
  const departments = ['All', 'Physics Department', 'Main Wing', 'Administrative', 'Infrastructure'];

  // Periodic wave simulation for the WiFi-CSI pulse telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseHeights(Array.from({ length: 16 }, () => Math.floor(Math.random() * 65) + 15));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDepartment === 'All' || room.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  // Calculate some overview numbers based on state database
  const activeAlertsCount = incidents.filter(i => !i.notified).length;
  const totalCampusOccupancy = rooms.reduce((acc, r) => acc + r.occupancy, 0);
  const totalEnergyConsumption = Number(rooms.reduce((acc, r) => acc + r.powerConsumption, 0).toFixed(1));

  return (
    <div id="dashboard-view-root" className="space-y-6">
      {/* Search & Top Filters row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-3xl p-4 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
          <input
            id="search-rooms-input"
            type="text"
            placeholder="Search campus rooms, labs, or zones..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 text-white placeholder-white/30 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {departments.map((dept) => (
            <button
              id={`dept-filter-${dept.replace(/\s+/g, '-').toLowerCase()}`}
              key={dept}
              onClick={() => setFilterDepartment(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap border ${
                filterDepartment === dept
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 border-cyan-400/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {dept === 'All' ? 'ALL DEPARTMENTS' : dept}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Bento Grid Left Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 id="monitoring-title" className="text-2xl font-black tracking-tight text-white">Global Monitoring</h2>
              <p className="text-white/60 text-sm mt-0.5">Live campus IoT safety indexes and network energy efficiency</p>
            </div>
            
            <div className="hidden md:flex gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-xs font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
                SYSTEM ACTIVE
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white/80 rounded-xl border border-white/10 text-xs font-bold font-mono">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                {totalCampusOccupancy} PLANNED
              </span>
            </div>
          </div>

          {/* Grid Layout of Classrooms & Laboratories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRooms.map((room) => {
              const occupancyPercent = room.capacity > 0 ? (room.occupancy / room.capacity) * 100 : 0;
              const isOverCapacity = room.occupancy > room.capacity;
              
              return (
                <article 
                  id={`room-card-${room.id}`}
                  key={room.id}
                  onClick={() => onNavigateToRoom(room.id)}
                  className={`bg-white/5 backdrop-blur-2xl border text-left rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(6,182,212,0.15)] hover:border-cyan-400/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                    isOverCapacity ? 'border-red-500/40 ring-1 ring-red-500/20' : 'border-white/10'
                  }`}
                >
                  {/* Decorative status strip */}
                  <div className={`h-1 w-full ${
                    isOverCapacity 
                      ? 'bg-red-500 shadow-[0_0_6px_red]' 
                      : room.csiStatus === 'standby' 
                        ? 'bg-white/20' 
                        : 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]'
                  }`} />

                  {/* Header metadata */}
                  <div className="p-4.5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-extrabold text-lg text-white group-hover:text-cyan-300 transition-colors">
                          {room.name}
                        </h3>
                        <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase">
                          {room.department}
                        </span>
                      </div>
                      
                      {isOverCapacity ? (
                        <div className="bg-red-500/10 text-red-400 p-1.5 rounded-lg animate-pulse border border-red-500/20">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                      ) : (
                        <span className="text-white/30 hover:text-white/60 p-1 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </span>
                      )}
                    </div>

                    {/* Occupancy and Energy levels */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className={`p-3 rounded-xl border ${
                        isOverCapacity 
                          ? 'bg-red-950/20 border-red-500/10' 
                          : 'bg-white/5 border-white/5'
                      }`}>
                      <p className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${isOverCapacity ? 'text-red-400' : 'text-white/40'}`}>
                          OCCUPANCY
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className={`font-mono font-extrabold text-xl ${isOverCapacity ? 'text-red-400' : 'text-white'}`}>
                            {room.occupancy.toString().padStart(2, '0')}
                          </span>
                          <span className="text-xs text-white/40 font-mono">/ {room.capacity}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                        <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider mb-0.5">CONSUMPTION</p>
                        <div className="flex items-baseline gap-1">
                          <span className="font-mono font-extrabold text-xl text-cyan-400">{room.powerConsumption}</span>
                          <span className="text-xs text-white/40 font-mono">kW</span>
                        </div>
                      </div>
                    </div>

                    {/* WiFi-CSI wave representation footer */}
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5 text-white/60">
                          <Wifi className={`h-3.5 w-3.5 ${room.csiStatus === 'high_turbulence' ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
                          <span className={`text-[10px] uppercase font-mono tracking-wider font-bold ${
                            room.csiStatus === 'high_turbulence' ? 'text-red-400' : 'text-white/80'
                          }`}>
                            {room.csiStatusLabel}
                          </span>
                        </div>
                        <span className={`text-[9px] font-mono font-bold ${
                          room.csiStatus === 'high_turbulence' ? 'text-red-400 animate-pulse' : 'text-white/40'
                        }`}>
                          {room.csiStatus === 'standby' ? 'STANDBY' : 'STABLE'}
                        </span>
                      </div>

                      {/* Animated wave bars container based on CSI status */}
                      <div className="h-8 flex items-end gap-0.5 overflow-hidden">
                        {room.csiStatus === 'standby' ? (
                          <div className="w-full h-[1px] bg-white/10" />
                        ) : room.csiStatus === 'high_turbulence' ? (
                          <div className="w-full flex justify-around gap-1 items-end h-full">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div 
                                key={i}
                                className="w-1 bg-red-400 rounded-full"
                                style={{ 
                                  height: `${Math.floor(Math.sin((i + Date.now()/150)) * 25) + 65}%`,
                                  transition: 'height 0.15s ease-in-out'
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="w-full flex justify-around gap-1 items-end h-full">
                            {pulseHeights.map((h, i) => (
                              <div 
                                key={i}
                                className="w-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                                style={{ 
                                  height: `${(i % 5 === 0 ? h * 0.4 : h * 0.85)}%`,
                                  transition: 'height 0.4s ease-in-out'
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <HelpCircle className="h-10 w-10 text-white/20 mx-auto mb-2" />
              <p className="text-white/60 text-sm">No rooms found matching your search query or department filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setFilterDepartment('All'); }}
                className="mt-4 px-4 py-2 bg-white text-black text-xs rounded-xl font-bold hover:bg-white/90 active:scale-95 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Live Incidents Sidebar Right Section */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-cyan-400 animate-pulse" />
              <h2 className="text-lg font-black text-white">Live Incidents</h2>
              {activeAlertsCount > 0 && (
                <span className="ml-auto bg-gradient-to-r from-red-500 to-amber-500 text-white px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black animate-pulse shadow-[0_0_8px_red]">
                  {activeAlertsCount}
                </span>
              )}
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
              {incidents.map((incident) => {
                const isCritical = incident.severity === 'critical';
                const isWarning = incident.severity === 'warning';
                
                return (
                  <div 
                    id={`incident-card-${incident.id}`}
                    key={incident.id} 
                    className={`border p-3.5 rounded-xl transition-all ${
                      isCritical
                        ? 'bg-red-500/10 border-red-500/20 shadow-sm'
                        : isWarning
                          ? 'bg-amber-500/10 border-amber-500/20'
                          : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex gap-2.5">
                      {isCritical ? (
                        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      ) : isWarning ? (
                        <Zap className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <Tv className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className={`font-bold text-sm ${
                            isCritical ? 'text-red-300' : isWarning ? 'text-amber-300' : 'text-white'
                          }`}>
                            {incident.title}
                          </h4>
                          <span className="text-[9px] font-mono font-bold text-white/40 shrink-0">
                            {incident.timeAgo}
                          </span>
                        </div>
                        <p className="text-xs text-white/70 mt-1 leading-relaxed">
                          {incident.message}
                        </p>
                        
                        {isCritical && (
                          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10 pt-2.5">
                            <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">
                              CRITICAL ALERT
                            </span>
                            <button
                              id={`notify-officer-btn-${incident.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotifyOfficer(incident.id);
                              }}
                              disabled={incident.notified}
                              className={`text-[10px] font-extrabold px-3 py-1 rounded-lg transition-all transform active:scale-95 ${
                                incident.notified 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-not-allowed'
                                  : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                              }`}
                            >
                              {incident.notified ? '✓ DISPATCHED' : 'DISPATCH OFFICER'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Blueprint Floor Overlay */}
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative">
            <div className="absolute inset-0 bg-slate-950/30 pointer-events-none group-hover:bg-slate-950/10 transition-all duration-300 z-10" />
            
            <img 
              id="blueprint-thumbnail"
              alt="Campus Blueprint" 
              className="w-full h-44 object-cover opacity-60 grayscale brightness-90 transition-all duration-300 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUA7ye_dZ4o1fLrCe3Zbw3I28wjtdpis_Nf1C1bmhdNxBdnbKIUMiZ7jxHfe80xRYFtjRWvxGGVQpn-AbCiLDsb18D6NEkGBN_l0Ks-3xRHFVjV4OPmu-37qMeloGeI8SFS42I2ua0A4eR-gyH97yVWhAeBHIkPqBdbWUlkO-6QoVS54eSSfAQq4aVXexqGfKVCKF1t_QtpB2LbaSXk6fgTJGS_Sl_-d09bR3Y2PcNsx8wVqVxsaX1Wy0vpcRqIx_zY69SEiPtGQ"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay indicators on the maps */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <span className="text-[10px] bg-slate-950/60 text-white/80 px-2 py-1 rounded backdrop-blur-md font-mono font-bold uppercase tracking-wider border border-white/5">
                Active Maps Grounding
              </span>
              <button 
                id="maximize-blueprint-btn" 
                className="bg-slate-950/60 text-white hover:bg-slate-900 transition-all rounded-lg p-1.5 backdrop-blur-md border border-white/10 active:scale-95"
                onClick={() => alert("Launching Interactive Level 02 Blueprint Editor... Active sensors coordinates loaded successfully.")}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="absolute bottom-4 left-4 z-20 text-white">
              <p className="text-[9px] font-bold tracking-widest text-cyan-400 uppercase">LEVEL 02 BLUEPRINT</p>
              <h5 className="font-extrabold text-base text-white">North Campus CAD</h5>
            </div>

            {/* Glowing critical radar ping relative to Lab 205 issue */}
            <div className="absolute top-1/3 left-1/2 w-4 h-4 z-20 -translate-x-1/2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-white shadow-[0_0_8px_red]"></span>
            </div>
            
            <div className="absolute top-1/2 left-1/4 w-3.5 h-3.5 z-20 -translate-x-1/2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70 animate-ping" style={{ animationDelay: '0.4s' }}></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border border-white shadow-[0_0_8px_cyan]"></span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
