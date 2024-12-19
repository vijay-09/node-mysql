require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db/index.js')
const appRoutes = require('./routes/app.routes.js')

const app = express()

app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', appRoutes)

db.sequelize.authenticate().then(() => {
    console.log('db.sequelize.authenticate(): Database connection has been established')

    /**
     * force: If force is true, each Model will run DROP TABLE IF EXISTS,
     *        before it tries to create its own table.
     * alter: Alters tables to fit models. Not recommended for production use.
     *        Deletes data in columns that were removed or had their type changed in the model.
     * logging: (Type: boolean | Function) A function that logs sql queries, or false for no logging.
     *          default value is console.log, if you don't want sql query log than just pass false value.
     */
    const options = {
        force: false,
        alter: false,
        logging: false
    }
    // Creating tables in the database based on models
    db.sequelize.sync(options).then(function () {
        console.log('db.sequelize.sync(): Database has been created')
        const appName = 'CONQT_TEST'
        const port = process.env.USER_PORT || 3000
        const myServer = app.listen(port, () => {
            console.log('app.listen(): %s is listening on port: %d (http://localhost:%d)', appName, port, port)
        })

        myServer.on('error', (err) => {
            console.error('app.listen(): onError(): My server failed to start: %o', err)
        })
    }).catch((err) => {
        console.error('db.sequelize.sync(): error: Unable to create the database: %o', err)
    })
}).catch(err => {
    console.error('db.sequelize.authenticate(): error: Unable to connect to the database: %o', err)
})
