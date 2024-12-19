const Sequelize = require('sequelize')
const db = require('../index.js')
const database = db.sequelize

class Categories extends Sequelize.Model {

}

const attributes = {
    categoryId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    categoryName: {
        type: Sequelize.STRING(255),
        defaultValue: null
    }
}

const options = {
    timestamps: true,
    sequelize: database,
    tableName: 'Categories'
}

module.exports = Categories.init(attributes, options)