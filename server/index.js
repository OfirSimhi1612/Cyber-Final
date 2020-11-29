const app = require('./app')

const port = process.env.NODE_ENV || 8080

app.listen(port,
    () => console.log(`litening on port ${port}
    env: ${process.env.NODE_ENV}`))

