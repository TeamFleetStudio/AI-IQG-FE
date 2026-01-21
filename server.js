// Custom server for Next.js to ensure proper binding
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Disable Next.js telemetry
process.env.NEXT_TELEMETRY_DISABLED = '1'

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
// Ensure port is a number, default to 3000 (not 80)
const port = parseInt(process.env.PORT || '3000', 10)

// Log configuration for debugging
console.log(`Starting server with hostname: ${hostname}, port: ${port}, NODE_ENV: ${process.env.NODE_ENV || 'development'}`)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})

