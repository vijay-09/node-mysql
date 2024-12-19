const Sequelize = require('sequelize')
const db = require('../index.js')
const database = db.sequelize

class CustomerUOM extends Sequelize.Model {

}

const attributes = {
    uomId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        defaultValue: null
    },
    code: {
        type: Sequelize.STRING(255),
        defaultValue: null
    }
}

const options = {
    timestamps: true,
    sequelize: database,
    tableName: 'CustomerUOM'
}

module.exports = CustomerUOM.init(attributes, options)