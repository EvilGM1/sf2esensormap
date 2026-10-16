import Peer, { DataConnection } from 'peerjs';
import { Starship } from '../types/sensor';

export interface SyncPayload {
  totalMapTiles: number;
  playerSensorRange: number;
  defaultSensorRange?: number;
  shipLevel: number;
  ships: Starship[];
}

export type SyncCallback = (data: SyncPayload) => void;

class TableSyncManager {
  private peer: Peer | null = null;
  private connections: DataConnection[] = [];
  private playerConn: DataConnection | null = null;
  private onStateReceived: SyncCallback | null = null;
  public roomId: string = '';
  public isHost: boolean = false;
  public connectedCount: number = 0;
  private onCountChange: ((count: number) => void) | null = null;

  // Initialize as GM Host
  initHost(roomId: string, onClientCountChange?: (count: number) => void) {
    this.cleanup();
    this.roomId = roomId;
    this.isHost = true;
    this.onCountChange = onClientCountChange || null;

    try {
      this.peer = new Peer(`sf2e-host-${roomId}`);

      this.peer.on('connection', (conn) => {
        this.connections.push(conn);
        this.updateCount();

        conn.on('close', () => {
          this.connections = this.connections.filter((c) => c !== conn);
          this.updateCount();
        });

        conn.on('error', () => {
          this.connections = this.connections.filter((c) => c !== conn);
          this.updateCount();
        });
      });
    } catch (e) {
      console.warn('PeerJS host init error', e);
    }
  }

  // Broadcast state to all connected player devices
  broadcastState(payload: SyncPayload) {
    if (!this.isHost) return;
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send({ type: 'SYNC_STATE', payload });
      }
    });
  }

  // Initialize as Player Client connecting to GM Room
  initClient(roomId: string, onState: SyncCallback) {
    this.cleanup();
    this.roomId = roomId;
    this.isHost = false;
    this.onStateReceived = onState;

    try {
      this.peer = new Peer();

      this.peer.on('open', () => {
        const conn = this.peer?.connect(`sf2e-host-${roomId}`);
        if (conn) {
          this.playerConn = conn;

          conn.on('open', () => {
            console.log('Connected to GM Sensor Map room:', roomId);
          });

          conn.on('data', (data: unknown) => {
            const msg = data as { type: string; payload: SyncPayload };
            if (msg && msg.type === 'SYNC_STATE' && this.onStateReceived) {
              this.onStateReceived(msg.payload);
            }
          });
        }
      });
    } catch (e) {
      console.warn('PeerJS client connect error', e);
    }
  }

  private updateCount() {
    this.connectedCount = this.connections.filter((c) => c.open).length;
    if (this.onCountChange) {
      this.onCountChange(this.connectedCount);
    }
  }

  cleanup() {
    this.connections.forEach((c) => c.close());
    this.connections = [];
    if (this.playerConn) {
      this.playerConn.close();
      this.playerConn = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}

export const tableSync = new TableSyncManager();
