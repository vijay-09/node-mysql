const Sequelize = require('sequelize')
const db = require('../index.js')
const database = db.sequelize

class Organizations extends Sequelize.Model {

}

const attributes = {
    organizationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    orgName: {
        type: Sequelize.STRING(100),
        defaultValue: null
    },
    orgDescription: {
        type: Sequelize.TEXT,
        defaultValue: null
    },
    orgLogoUrl: {
        type: Sequelize.TEXT,
        defaultValue: null
    }
}

const options = {
    timestamps: true,
    sequelize: database,
    tableName: 'Organizations'
}

module.exports = Organizations.init(attributes, options)