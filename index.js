const express = require('express')
const serveIndex = require('serve-index')

const app = express()
app.use('/', express.static('.'), serveIndex('.', { icons: true }))
app.listen(3000)
console.log('Flowgramming listening at http://localhost:3000')
