const ProcessMessage = {
  success(data: {
    outPath: string
  } | {
    host: string
    port: number
  }) {
    process.send && process.send({ method: 'success', data })
  },
  fail(message: string) {
    process.send && process.send({ method: 'fail', data: message })
  }
}

export default ProcessMessage