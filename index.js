const app = require('./app')
const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
    console.log('Application running on port...@9000')
})
