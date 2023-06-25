export interface Locker {
  id: number
  rut?: string
  password?: string
  used: boolean
  lockStatus: 'LOCKED' | 'UNLOCKED' | 'WAITING'
}


export interface shadow {
  state: {
    desired: {
      lockers: { [lockerId: string]: Locker }
      timestamp: number
    }
    reported: {
      lockers: { [lockerId: string]: Locker }
      timestamp: number
    }
  }
}
