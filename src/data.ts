import { Room, PowerLoad, AuditLogEntry, LiveIncident, FleetNode, ForgottenDevice } from './types';

export const initialRooms: Room[] = [
  {
    id: 'lab-204',
    name: 'Lab 204',
    department: 'Physics Department',
    occupancy: 12,
    capacity: 20,
    powerConsumption: 1.2,
    csiStatus: 'stable',
    csiStatusLabel: 'WIFI-CSI PULSE',
    signalStrength: -42,
    interference: 'LOW',
    stability: 99.8,
    sustainedMotion: 'High',
    thermalSignature: 'Normal',
    hasIncident: false
  },
  {
    id: 'lecture-101',
    name: 'Lecture Hall 101',
    department: 'Main Wing',
    occupancy: 0,
    capacity: 120,
    powerConsumption: 0.4,
    csiStatus: 'standby',
    csiStatusLabel: 'WIFI-CSI IDLE',
    signalStrength: -68,
    interference: 'MEDIUM',
    stability: 92.4,
    sustainedMotion: 'Low',
    thermalSignature: 'Low',
    hasIncident: false
  },
  {
    id: 'lab-205',
    name: 'Lab 205',
    department: 'Physics Department',
    occupancy: 24,
    capacity: 20,
    powerConsumption: 2.8,
    csiStatus: 'high_turbulence',
    csiStatusLabel: 'HIGH TURBULENCE',
    signalStrength: -31,
    interference: 'LOW',
    stability: 99.9,
    sustainedMotion: 'High',
    thermalSignature: 'High',
    hasIncident: true
  },
  {
    id: 'office-302',
    name: 'Office 302',
    department: 'Administrative',
    occupancy: 2,
    capacity: 5,
    powerConsumption: 0.8,
    csiStatus: 'stable',
    csiStatusLabel: 'WIFI-CSI PULSE',
    signalStrength: -55,
    interference: 'LOW',
    stability: 97.5,
    sustainedMotion: 'Normal',
    thermalSignature: 'Normal',
    hasIncident: false
  },
  {
    id: 'server-b',
    name: 'Data Center B',
    department: 'Infrastructure',
    occupancy: 1,
    capacity: 4,
    powerConsumption: 14.5,
    csiStatus: 'stable',
    csiStatusLabel: 'WIFI-CSI PULSE',
    signalStrength: -38,
    interference: 'LOW',
    stability: 99.9,
    sustainedMotion: 'Normal',
    thermalSignature: 'High',
    hasIncident: false
  },
  {
    id: 'lounge-4',
    name: 'Lounge Zone 4',
    department: 'West Wing',
    occupancy: 8,
    capacity: 30,
    powerConsumption: 1.5,
    csiStatus: 'stable',
    csiStatusLabel: 'WIFI-CSI PULSE',
    signalStrength: -61,
    interference: 'HIGH',
    stability: 89.1,
    sustainedMotion: 'Normal',
    thermalSignature: 'Normal',
    hasIncident: false
  }
];

export const initialPowerLoads: PowerLoad[] = [
  { id: 'load-1', name: 'Cryogenic Cooling Array', type: 'critical', status: true, isLocked: true },
  { id: 'load-2', name: 'Primary Laser Oscillator', type: 'critical', status: true, isLocked: true },
  { id: 'load-3', name: 'Ambient Lighting Zone B', type: 'whitelist', status: true, isLocked: false },
  { id: 'load-4', name: 'Auxiliary Workstations', type: 'whitelist', status: true, isLocked: false },
  { id: 'load-5', name: 'Non-Critical HVAC Vent', type: 'whitelist', status: false, isLocked: false }
];

export const initialAuditLogs: AuditLogEntry[] = [
  { id: 'l-1', timestamp: '14:22:04', type: 'Occupancy Event', message: 'Zone 2 detected person entry (CSI Confidence 94%).' },
  { id: 'l-2', timestamp: '14:18:12', type: 'Power Adjustment', message: 'Auxiliary Workstations state changed to ENABLED by ID:8842.' },
  { id: 'l-3', timestamp: '13:55:00', type: 'Alert: Sensor Drift', message: 'HVAC Sensor B-4 reported 0.4°C variance from baseline.', isAlert: true },
  { id: 'l-4', timestamp: '13:30:22', type: 'Policy Update', message: 'Facility white-list updated. 3 new devices authorized.' },
  { id: 'l-5', timestamp: '12:04:15', type: 'System Audit', message: 'Scheduled health check completed. All gateways responsive.' }
];

export const initialIncidents: LiveIncident[] = [
  {
    id: 'inc-1',
    type: 'warning',
    title: 'Capacity Overflow',
    roomId: 'lab-205',
    roomName: 'Lab 205',
    severity: 'critical',
    message: 'Lab 205 has exceeded safety occupancy limit by 20%.',
    timeAgo: '2M AGO',
    notified: false
  },
  {
    id: 'inc-2',
    type: 'bolt',
    title: 'Energy Spike',
    roomId: 'lab-204',
    roomName: 'Lab 204',
    severity: 'warning',
    message: 'Unusual power surge detected in Lab 204. Equipment audit recommended.',
    timeAgo: '14M AGO',
    notified: false
  },
  {
    id: 'inc-3',
    type: 'leak_remove',
    title: 'Sensor Offline',
    roomId: 'office-302',
    roomName: 'Office 302',
    severity: 'info',
    message: 'WiFi-CSI node SS-049 in Office 302 reported intermittent connectivity.',
    timeAgo: '45M AGO',
    notified: false
  }
];

export const initialFleetNodes: FleetNode[] = [
  { id: 'ESP32-S3-A29F', location: 'North Wing / Zone 4', zone: 'North Wing', battery: 12, signalBars: 2, firmware: 'v2.4.1-rc', calibration: 'Calibrated', status: 'low_battery' },
  { id: 'ESP32-S3-B882', location: 'Server Room 01', zone: 'Data Center B', battery: 94, signalBars: 4, firmware: 'v2.4.0', calibration: 'Needs Drift Correction', status: 'online' },
  { id: 'ESP32-S3-F110', location: 'Docking Bay A', zone: 'Executive Suites', battery: 48, signalBars: 3, firmware: 'v2.4.0', calibration: 'Calibrated', status: 'online' },
  { id: 'ESP32-S3-C122', location: 'Lab 204 Front Gate', zone: 'North Wing', battery: 85, signalBars: 4, firmware: 'v2.4.0', calibration: 'Calibrated', status: 'online' },
  { id: 'ESP32-S3-D945', location: 'Storage Closet C', zone: 'North Wing', battery: 8, signalBars: 1, firmware: 'v2.3.9', calibration: 'Calibrated', status: 'low_battery' },
  { id: 'ESP32-S3-K889', location: 'Lounge Zone B', zone: 'Executive Suites', battery: 0, signalBars: 0, firmware: 'v2.4.0', calibration: 'Needs Drift Correction', status: 'offline' },
  { id: 'ESP32-S3-M331', location: 'Main Entrance 01', zone: 'North Wing', battery: 91, signalBars: 4, firmware: 'v2.4.1-rc', calibration: 'Calibrated', status: 'online' },
  { id: 'ESP32-S3-P204', location: 'Lab 204 Back corner', zone: 'North Wing', battery: 34, signalBars: 3, firmware: 'v2.4.0', calibration: 'Calibrated', status: 'online' },
  { id: 'ESP32-S3-R402', location: 'Lecture Hall Stage', zone: 'North Wing', battery: 5, signalBars: 2, firmware: 'v2.4.0', calibration: 'Calibrated', status: 'low_battery' },
  { id: 'ESP32-S3-W501', location: 'Main Server Isle Left', zone: 'Data Center B', battery: 98, signalBars: 4, firmware: 'v2.4.0', calibration: 'Calibrated', status: 'online' },
  { id: 'ESP32-S3-Z911', location: 'Administrator Office Front Desk', zone: 'Executive Suites', battery: 60, signalBars: 3, firmware: 'v2.4.0', calibration: 'Needs Drift Correction', status: 'online' },
  { id: 'ESP32-S3-X200', location: 'UPS Power backup node', zone: 'Data Center B', battery: 3, signalBars: 1, firmware: 'v2.4.0', calibration: 'Needs Drift Correction', status: 'low_battery' }
];

export const initialForgottenDevices: ForgottenDevice[] = [
  { id: 'fd-1', name: 'HP Laserjet 500', location: 'West Wing Lab', idleSince: '14:22:00', costImpact: 0.42 },
  { id: 'fd-2', name: 'Smart Display 04', location: 'Conf Room B', idleSince: '09:15:00', costImpact: 0.18 },
  { id: 'fd-3', name: 'Testing Rig alpha', location: 'R&D Floor 2', idleSince: '48:00:00', costImpact: 2.40 }
];
