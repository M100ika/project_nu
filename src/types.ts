export interface Room {
  id: string;
  name: string;
  department: string;
  occupancy: number;
  capacity: number;
  powerConsumption: number; // in kW
  csiStatus: 'stable' | 'idle' | 'high_turbulence' | 'standby';
  csiStatusLabel: string;
  signalStrength: number; // e.g. -42 dBm
  interference: 'LOW' | 'MEDIUM' | 'HIGH';
  stability: number; // percentage
  sustainedMotion: 'High' | 'Normal' | 'Low';
  thermalSignature: 'High' | 'Normal' | 'Low';
  hasIncident: boolean;
}

export interface PowerLoad {
  id: string;
  name: string;
  type: 'critical' | 'whitelist';
  status: boolean; // true = ON, false = OFF
  isLocked: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string; // "14:22:04"
  type: string; // "Occupancy Event", "Power Adjustment"
  message: string;
  isAlert?: boolean;
}

export interface LiveIncident {
  id: string;
  type: string;
  title: string;
  roomId: string;
  roomName: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timeAgo: string;
  notified?: boolean;
}

export interface FleetNode {
  id: string;
  location: string;
  zone: string;
  battery: number; // percentage
  signalBars: number; // 1 to 4
  firmware: string;
  calibration: 'Calibrated' | 'Needs Drift Correction' | 'Calibrating';
  status: 'online' | 'low_battery' | 'offline';
}

export interface ForgottenDevice {
  id: string;
  name: string;
  location: string;
  idleSince: string;
  costImpact: number; // dollars per hour
  isShuttingDown?: boolean;
  isShutdown?: boolean;
}
