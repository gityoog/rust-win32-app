interface Call {
  (name: 'minimize'): void
  (name: 'maximize'): void
  (name: 'restore'): void
  (name: 'close'): void
  (name: 'isZoomed'): boolean
  (name: 'move'): void
  (name: 'resize'): void
  (name: 'ready'): void
}

const JSBridge: {
  call: Call
} = {
  call: (name, ...arg: any[]) => {
    // @ts-ignore
    if (typeof (window.external?.[name]) !== 'undefined') {
      // @ts-ignore
      return window.external[name](arg[0], arg[1], arg[2], arg[3], arg[4])
    }
  }
}
export default JSBridge