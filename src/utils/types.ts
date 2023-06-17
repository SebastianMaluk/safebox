export interface Locker {
  id: number
  rut: string
  password?: string
  used: boolean
  open: boolean
}

export interface Command {
  lockerId: number
  action: 'lock' | 'unlock'
  executed: boolean
}
export interface shadow {
  'state': {
    'desired': {
      'lockers': Locker[]
      'status': {
        'onlineAt': Date
      }
      'command': Command
      'led': {
        'onboard': number
      }
    },
    'reported': {
      'welcome': 'aws-iot',
      'led': {
        'onboard': number
      },
      'device': {
        'client': 'esp_lamp',
        'uptime': number
        'firmware': '1.19.1',
        'hardware': 'esp32'
      }
    }
  }
}