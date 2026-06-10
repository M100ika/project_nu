import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Wifi, 
  Tv, 
  User, 
  Sparkles, 
  Sliders, 
  BookOpen, 
  Bell, 
  LayoutDashboard, 
  Layers, 
  FileCheck,
  Cpu,
  RefreshCw,
  Heart
} from 'lucide-react';
import { Room, PowerLoad, AuditLogEntry, LiveIncident, FleetNode, ForgottenDevice } from './types';
import { 
  initialRooms, 
  initialPowerLoads, 
  initialAuditLogs, 
  initialIncidents, 
  initialFleetNodes, 
  initialForgottenDevices 
} from './data';

// Import our modular screen subcomponents
import DashboardView from './components/DashboardView';
import Lab204View from './components/Lab204View';
import StatsView from './components/StatsView';
import DevicesView from './components/DevicesView';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'facilities' | 'stats' | 'devices'>('dashboard');
  
  // Application Shared state
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [powerLoads, setPowerLoads] = useState<PowerLoad[]>(initialPowerLoads);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [incidents, setIncidents] = useState<LiveIncident[]>(initialIncidents);
  const [fleetNodes, setFleetNodes] = useState<FleetNode[]>(initialFleetNodes);
  
  // Real-time notification counters
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [simulateStatusText, setSimulateStatusText] = useState<'nominal' | 'alert' | 'tuning'>('nominal');

  // Trigger dynamic data fluctuations over time to simulate a real connected IoT dashboard
  useEffect(() => {
    const simulatorInterval = setInterval(() => {
      // Fluctuate room occupancy slightly for realism
      setRooms(prevRooms => prevRooms.map(room => {
        // Lab 204 / Office 302 have small changes periodically
        if (room.id === 'lab-204' && Math.random() > 0.75) {
          const delta = Math.random() > 0.5 ? 1 : -1;
          const targetOcc = Math.max(8, Math.min(room.capacity, room.occupancy + delta));
          return { ...room, occupancy: targetOcc };
        }
        if (room.id === 'office-302' && Math.random() > 0.8) {
          const delta = Math.random() > 0.5 ? 1 : -1;
          const targetOcc = Math.max(1, Math.min(room.capacity, room.occupancy + delta));
          return { ...room, occupancy: targetOcc };
        }
        return room;
      }));

      // Randomly fluctuation power metrics
      setRooms(prevRooms => prevRooms.map(room => {
        if (room.id !== 'lecture-101' && Math.random() > 0.85) {
          const deltaFloat = Number(((Math.random() - 0.5) * 0.15).toFixed(2));
          return { ...room, powerConsumption: Number(Math.max(0.3, room.powerConsumption + deltaFloat).toFixed(2)) };
        }
        return room;
      }));
    }, 4500);

    return () => clearInterval(simulatorInterval);
  }, []);

  // Handler for dispatching officer
  const handleNotifyOfficer = (incidentId: string) => {
    setIncidents(prevInc => prevInc.map(i => {
      if (i.id === incidentId) {
        return { ...i, notified: true, message: `${i.message} [Officer notified over secure UHF frequency].` };
      }
      return i;
    }));
    
    // Decrement counter
    setUnreadNotifications(prev => Math.max(0, prev - 1));

    // Append to central audit logs
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newLog: AuditLogEntry = {
      id: `dyn-log-${Date.now()}`,
      timestamp,
      type: 'Security Action Dispatch',
      message: `Emergency safety officer dispatched to Room/Sector containing incident ${incidentId}.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler for deep-linking from room grid cards
  const handleRoomCardClick = (roomId: string) => {
    if (roomId === 'lab-204') {
      setActiveTab('facilities');
    } else {
      const roomObj = rooms.find(r => r.id === roomId);
      alert(`Connecting to ${roomObj?.name} secure stream...\nLocation: ${roomObj?.department}\nOccupancy: ${roomObj?.occupancy}/${roomObj?.capacity}\nPower Index: ${roomObj?.powerConsumption} kW\nWiFi-CSI telemetry status: ${roomObj?.csiStatus.toUpperCase()}`);
    }
  };

  // Handler for committing load shedding
  const handleCommitLoadShedding = (updatedLoads: PowerLoad[]) => {
    setPowerLoads(updatedLoads);
    
    // Calculate difference
    const activeLoadsCount = updatedLoads.filter(l => l.type === 'whitelist' && l.status).length;
    // Calculate simulated wattage
    const updatedPowerIndex = Number((2.0 + activeLoadsCount * 0.45).toFixed(2));
    
    setRooms(prev => prev.map(r => {
      if (r.id === 'lab-204') {
        return { ...r, powerConsumption: updatedPowerIndex };
      }
      return r;
    }));
  };

  // Handler for adding a registered node to list
  const handleAddNewNode = (newNode: FleetNode) => {
    setFleetNodes(prev => [newNode, ...prev]);
    
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newLog: AuditLogEntry = {
      id: `dyn-log-${Date.now()}`,
      timestamp,
      type: 'Network Sync',
      message: `IoT Node ${newNode.id} provisioned at '${newNode.location}' successfully verified.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler for fleet bulk sync
  const handleFleetBulkSync = () => {
    // Upgrading versions across all fleet nodes
    setFleetNodes(prev => prev.map(node => ({
      ...node,
      firmware: 'v2.4.1-rc',
      calibration: 'Calibrated'
    })));
    
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newLog: AuditLogEntry = {
      id: `dyn-log-${Date.now()}`,
      timestamp,
      type: 'Policy Update',
      message: 'Hardware firmware rollout executed. Synced 124 wireless nodes.'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    alert('OTA sync command dispatched. Hardware calibration parameters reset successfully.');
  };

  return (
    <div className="bg-slate-950 min-h-screen font-sans flex flex-col justify-between selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden">
      
      {/* Animated Mesh Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[0%] w-[600px] h-[600px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[90px] opacity-15 pointer-events-none"></div>
      
      {/* Top Main Navigation Header Bar */}
      <header className="sticky top-0 w-full z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand Brand elements */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Shield className="h-5.5 w-5.5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              SAFESPACE <span className="font-light text-cyan-400 text-xs align-super ml-1 border border-cyan-400/30 px-1 py-0.5 rounded text-[9px] tracking-widest">OS</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 h-full">
            <button 
              id="nav-link-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-xl ${
                activeTab === 'dashboard'
                  ? 'text-white bg-white/12 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              DASHBOARD
            </button>
            <button 
              id="nav-link-facilities"
              onClick={() => setActiveTab('facilities')}
              className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-xl ${
                activeTab === 'facilities'
                  ? 'text-white bg-white/12 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              FACILITIES
            </button>
            <button 
              id="nav-link-stats"
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-xl ${
                activeTab === 'stats'
                  ? 'text-white bg-white/12 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              STATS
            </button>
            <button 
              id="nav-link-devices"
              onClick={() => setActiveTab('devices')}
              className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-xl ${
                activeTab === 'devices'
                  ? 'text-white bg-white/12 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              DEVICES
            </button>
          </nav>

          {/* Right hand support tags */}
          <div className="flex items-center gap-3">
            <span className="p-2 text-white/60 hover:text-white rounded-full cursor-pointer relative bg-white/5 border border-white/10 hover:bg-white/10 transition-all" title={`Active Alerts: ${unreadNotifications}`}>
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />
              )}
            </span>
            
            <div className="flex items-center gap-1.5 bg-cyan-500/15 border border-cyan-500/20 p-1.5 px-3 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_cyan] animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">ACTIVE FEED</span>
            </div>
            
            <div 
              onClick={() => alert("SafeSpace administrator console active.\nAuthenticated as maxat.suieubayev@gmail.com")}
              className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 transition-all flex items-center justify-center overflow-hidden cursor-pointer active:scale-95"
              title="View SafeSpace Admin credentials"
            >
              <User className="h-4.5 w-4.5 text-white/80" />
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Render Box */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardView 
            rooms={rooms}
            incidents={incidents}
            onNavigateToRoom={handleRoomCardClick}
            onNotifyOfficer={handleNotifyOfficer}
          />
        )}
        
        {activeTab === 'facilities' && (
          <Lab204View 
            initialLoads={powerLoads}
            initialLogs={auditLogs}
            onCommitLoadShedding={handleCommitLoadShedding}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView 
            initialForgottenDevices={initialForgottenDevices}
          />
        )}

        {activeTab === 'devices' && (
          <DevicesView 
            initialNodes={fleetNodes}
            onAddNewNode={handleAddNewNode}
            onBulkSync={handleFleetBulkSync}
          />
        )}
      </main>

      {/* Mobile/Tablet Bottom Navigation Bar (Hidden on medium sizes up) */}
      <nav className="md:hidden sticky bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 py-1.5 flex justify-around items-center shadow-2xl">
        <button 
          id="mobile-nav-dashboard"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'text-white scale-102 font-bold bg-white/5 border border-white/5' : 'text-white/50'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="text-[10px] mt-0.5 tracking-wide font-semibold">Dashboard</span>
        </button>
        <button 
          id="mobile-nav-facilities"
          onClick={() => setActiveTab('facilities')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${
            activeTab === 'facilities' ? 'text-white scale-102 font-bold bg-white/5 border border-white/5' : 'text-white/50'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span className="text-[10px] mt-0.5 tracking-wide font-semibold">Facilities</span>
        </button>
        <button 
          id="mobile-nav-stats"
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${
            activeTab === 'stats' ? 'text-white scale-102 font-bold bg-white/5 border border-white/5' : 'text-white/50'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span className="text-[10px] mt-0.5 tracking-wide font-semibold">Stats</span>
        </button>
        <button 
          id="mobile-nav-devices"
          onClick={() => setActiveTab('devices')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${
            activeTab === 'devices' ? 'text-white scale-102 font-bold bg-white/5 border border-white/5' : 'text-white/50'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span className="text-[10px] mt-0.5 tracking-wide font-semibold">Devices</span>
        </button>
      </nav>

      {/* Silent elegant footer bar */}
      <footer className="w-full text-center py-5 border-t border-white/10 text-white/40 text-xs bg-slate-950/40 backdrop-blur-md">
        <p className="flex items-center justify-center gap-2">
          <span>SafeSpace IoT Operations Control Panel • 2026 Admin Suite</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_cyan] block shrink-0 inline" />
        </p>
      </footer>

    </div>
  );
}
