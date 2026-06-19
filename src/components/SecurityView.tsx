import React, { useState } from 'react';
import { Room, LiveIncident, AuditLogEntry } from '../types';
import {
  Users, AlertTriangle, Zap, Clock, ClipboardList, Shield, MapPin
} from 'lucide-react';

interface SecurityViewProps {
  rooms: Room[];
  incidents: LiveIncident[];
  auditLogs: AuditLogEntry[];
}

type RoomStatus = 'overcrowded' | 'incident' | 'empty-powered' | 'high' | 'occupied' | 'clear';

const STATUS_CONFIG: Record<RoomStatus, { label: string; cardCls: string; badgeCls: string; barCls: string }> = {
  overcrowded:   { label: 'OVERCROWDED',      cardCls: 'bg-red-500/10 border-red-500/30',    badgeCls: 'bg-red-500/20 text-red-400',     barCls: 'bg-red-500' },
  incident:      { label: 'INCIDENT',          cardCls: 'bg-amber-500/10 border-amber-500/30', badgeCls: 'bg-amber-500/20 text-amber-400', barCls: 'bg-amber-400' },
  'empty-powered':{ label: 'EQUIP ON — EMPTY', cardCls: 'bg-orange-500/8 border-orange-400/30',badgeCls: 'bg-orange-500/20 text-orange-400',barCls: 'bg-orange-400' },
  high:          { label: 'HIGH OCCUPANCY',    cardCls: 'bg-yellow-500/8 border-yellow-500/20',badgeCls: 'bg-yellow-500/20 text-yellow-400',barCls: 'bg-yellow-400' },
  occupied:      { label: 'OCCUPIED',          cardCls: 'bg-white/5 border-white/10',          badgeCls: 'bg-emerald-500/15 text-emerald-400',barCls: 'bg-emerald-400' },
  clear:         { label: 'CLEAR',             cardCls: 'bg-white/3 border-white/5',           badgeCls: 'bg-white/10 text-white/30',      barCls: 'bg-white/20' },
};

function getRoomStatus(room: Room): RoomStatus {
  if (room.occupancy > room.capacity) return 'overcrowded';
  if (room.hasIncident) return 'incident';
  if (room.occupancy === 0 && room.powerConsumption > 0.3) return 'empty-powered';
  if (room.occupancy === 0) return 'clear';
  if (room.occupancy / room.capacity > 0.8) return 'high';
  return 'occupied';
}

export default function SecurityView({ rooms, incidents, auditLogs }: SecurityViewProps) {
  const [sweepDone, setSweepDone] = useState(false);

  const totalPeople = rooms.reduce((s, r) => s + r.occupancy, 0);
  const occupiedRooms = rooms.filter(r => r.occupancy > 0);
  const overCapacity = rooms.filter(r => r.occupancy > r.capacity);
  const emptyPowered = rooms.filter(r => r.occupancy === 0 && r.powerConsumption > 0.3);
  const incidentRooms = rooms.filter(r => r.hasIncident && r.occupancy <= r.capacity);
  const attentionCount = new Set([...overCapacity, ...emptyPowered, ...incidentRooms]).size;
  const activeIncidents = incidents.filter(i => !i.notified).length;

  const handleSweep = () => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const lines: string[] = [
      `=== END-OF-DAY SWEEP REPORT ===`,
      `Generated: ${time}  |  SafeSpace OS`,
      ``,
      `CAMPUS STATUS`,
      `  People still on campus : ${totalPeople}`,
      `  Occupied rooms          : ${occupiedRooms.length} / ${rooms.length}`,
      `  Active incidents        : ${activeIncidents}`,
      ``,
    ];

    if (occupiedRooms.length > 0) {
      lines.push('ROOMS WITH PEOPLE:');
      occupiedRooms.forEach(r => {
        const over = r.occupancy > r.capacity ? '  ⚠ OVER CAPACITY' : '';
        lines.push(`  • ${r.name.padEnd(22)} ${r.occupancy}/${r.capacity} persons${over}`);
      });
      lines.push('');
    }

    if (emptyPowered.length > 0) {
      lines.push('EQUIPMENT LEFT ON (empty rooms):');
      emptyPowered.forEach(r => lines.push(`  • ${r.name.padEnd(22)} ${r.powerConsumption} kW running`));
      lines.push('');
    }

    if (occupiedRooms.length === 0 && emptyPowered.length === 0) {
      lines.push('All clear. Building ready to lock.');
    }

    alert(lines.join('\n'));
    setSweepDone(true);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Security Patrol</h2>
          <p className="text-white/50 text-sm mt-0.5">Live occupancy status · all monitored areas</p>
        </div>
        <button
          onClick={handleSweep}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl active:scale-95 transition-all ${
            sweepDone
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_28px_rgba(6,182,212,0.5)]'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          {sweepDone ? 'Report Generated' : 'End-of-Day Sweep'}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="People on Campus" value={totalPeople} color="cyan" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Occupied Rooms" value={`${occupiedRooms.length} / ${rooms.length}`} color="indigo" icon={<MapPin className="h-5 w-5" />} />
        <StatCard
          label="Needs Attention"
          value={attentionCount}
          color={attentionCount > 0 ? 'red' : 'emerald'}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard label="Active Incidents" value={activeIncidents} color="amber" icon={<Shield className="h-5 w-5" />} />
      </div>

      {/* Attention panel */}
      {attentionCount > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
            <h3 className="font-black text-white text-base">Needs Attention</h3>
            <span className="ml-auto text-[10px] font-mono font-black bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full">
              {attentionCount} ROOM{attentionCount > 1 ? 'S' : ''}
            </span>
          </div>
          <div className="space-y-2">
            {overCapacity.map(r => (
              <AttentionRow key={r.id} dot="bg-red-500" name={r.name} detail={`Over capacity — ${r.occupancy}/${r.capacity} people`} />
            ))}
            {emptyPowered.map(r => (
              <AttentionRow key={r.id} dot="bg-orange-400" name={r.name} detail={`Empty room — ${r.powerConsumption} kW still running`} />
            ))}
            {incidentRooms.map(r => (
              <AttentionRow key={r.id} dot="bg-amber-400" name={r.name} detail="Active incident reported" />
            ))}
          </div>
        </div>
      )}

      {/* Room grid */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">All Areas — Live Status</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rooms.map(room => {
            const status = getRoomStatus(room);
            const cfg = STATUS_CONFIG[status];
            const pct = room.capacity > 0 ? Math.min(100, Math.round((room.occupancy / room.capacity) * 100)) : 0;
            return (
              <div key={room.id} className={`rounded-2xl border p-4 transition-all ${cfg.cardCls}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 mr-2">
                    <h4 className="font-extrabold text-white text-sm leading-tight">{room.name}</h4>
                    <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">{room.department}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shrink-0 ${cfg.badgeCls}`}>
                    {cfg.label}
                  </span>
                </div>

                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-[9px] text-white/35 uppercase tracking-wider mb-0.5">People</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono font-black text-2xl text-white">{room.occupancy}</span>
                      <span className="text-xs text-white/35 font-mono">/ {room.capacity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-white/35 uppercase tracking-wider mb-0.5">Power</p>
                    <div className="flex items-center gap-1">
                      {status === 'empty-powered' && <Zap className="h-3 w-3 text-orange-400" />}
                      <span className={`font-mono font-bold text-sm ${status === 'empty-powered' ? 'text-orange-400' : 'text-white/50'}`}>
                        {room.powerConsumption} kW
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${cfg.barCls}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shift log */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-cyan-400" />
          <h3 className="font-black text-white text-base">Shift Log</h3>
          <span className="text-[10px] text-white/30 font-mono ml-auto">LAST {Math.min(auditLogs.length, 6)} EVENTS</span>
        </div>
        <div className="space-y-0">
          {auditLogs.slice(0, 6).map((log, i) => (
            <div
              key={log.id}
              className={`flex gap-3 text-xs py-2.5 ${i < Math.min(auditLogs.length, 6) - 1 ? 'border-b border-white/5' : ''}`}
            >
              <span className="font-mono text-white/25 shrink-0 w-14">{log.timestamp}</span>
              <span className={`font-bold shrink-0 w-32 truncate ${log.isAlert ? 'text-amber-400' : 'text-white/40'}`}>{log.type}</span>
              <span className="text-white/55 leading-relaxed">{log.message}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function StatCard({ label, value, icon, color }: {
  label: string; value: string | number; icon: React.ReactNode; color: string;
}) {
  const colorCls: Record<string, string> = {
    cyan:    'text-cyan-400',
    indigo:  'text-indigo-400',
    red:     'text-red-400',
    emerald: 'text-emerald-400',
    amber:   'text-amber-400',
  };
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className={`mb-2 ${colorCls[color] ?? 'text-cyan-400'}`}>{icon}</div>
      <p className="font-mono font-black text-2xl text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-white/35 mt-0.5">{label}</p>
    </div>
  );
}

function AttentionRow({ dot, name, detail }: { dot: string; name: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3">
      <span className={`w-2 h-2 rounded-full shrink-0 ${dot} shadow-[0_0_6px_currentColor]`} />
      <span className="font-bold text-white text-sm">{name}</span>
      <span className="text-white/45 text-xs ml-auto shrink-0">{detail}</span>
    </div>
  );
}
