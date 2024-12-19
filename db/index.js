// IMPORT SECTION
require('dotenv').config()
const Sequelize = require('sequelize')

const database = 'conqtvms_dev'
const username = 'candidate'
const password = 'NoTeDeSt^C10.6?SxwY882}'
const options = {
    dialect: 'mysql',
    host: 'nodejs-technical-test.cm30rlobuoic.ap-southeast-1.rds.amazonaws.com',
    port: 3306,
    pool: {
        max: 20,
        min: 0,
        acquire: 60000,
        idle: 10000
    },
    dialectOptions: {
    }
}
module.exports.sequelize = new Sequelize(database, username, password, options)
