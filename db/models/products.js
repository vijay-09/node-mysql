const Sequelize = require('sequelize')
const db = require('../index.js')
const database = db.sequelize

const Organizations = require('./Organizations');
const CustomerUOM = require('./customer.uom');
const Categories = require('./categories')

class ProductV2 extends Sequelize.Model {

}

const attributes = {
    productId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    productName: {
        type: Sequelize.STRING(200),
        defaultValue: null
    },
    productImagesName: {
        type: Sequelize.TEXT,
        defaultValue: null
    },
    productImagesUrls: {
        type: Sequelize.TEXT,
        defaultValue: null
    },
    brandName: {
        type: Sequelize.STRING(200),
        defaultValue: ''
    },
    description: {
        type: Sequelize.TEXT,
        defaultValue: null
    },
    itemCode: {
        type: Sequelize.STRING(40),
        defaultValue: null
    },
    itemType: {
        type: Sequelize.STRING(200),
        defaultValue: null
    },
    currency: {
        type: Sequelize.STRING(100),
        defaultValue: null
    },
    currencyCode: {
        type: Sequelize.TEXT,
        defaultValue: null
    },
    saleAmount: {
        type: Sequelize.FLOAT,
        defaultValue: null
    },
    broshureFileName: {
        type: Sequelize.STRING(255),
        defaultValue: null
    },
    broshureUrls: {
        type: Sequelize.TEXT,
        defaultValue: null
    },
    vendors: {
        type: Sequelize.TEXT,
        defaultValue: null
    },
    status: {
        type: Sequelize.TINYINT,
        defaultValue: 1
    },
    deleteFlag: {
        type: Sequelize.TINYINT,
        defaultValue: 0
    },
    createdAt: {
        type: Sequelize.DATE
    },
    updatedAt: {
        type: Sequelize.DATE
    },
    createdBy: {
        type: Sequelize.INTEGER,
        defaultValue: null
    },
    custOrgId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Organizations',
            key: 'organizationId'
        }
    },
    categoryId: {
        type: Sequelize.INTEGER
    },
    subCategoryId: {
        type: Sequelize.INTEGER
    },
    uomId: {
        type: Sequelize.INTEGER
    },
    shipingMethodId: {
        type: Sequelize.INTEGER
    },
    shippingTermId: {
        type: Sequelize.INTEGER
    },
    paymentTermId: {
        type: Sequelize.INTEGER
    }
}

const options = {
    timestamps: true,
    sequelize: database,
    tableName: 'ProductV2'
}

module.exports = ProductV2.init(attributes, options)

Organizations.ProductV2 = Organizations.hasOne(ProductV2, { foreignKey: 'custOrgId' })
ProductV2.belongsTo(Organizations, { foreignKey: 'custOrgId' })

CustomerUOM.ProductV2 = CustomerUOM.hasOne(ProductV2, { foreignKey: 'uomId' })
ProductV2.belongsTo(CustomerUOM, { foreignKey: 'uomId' })

// Categories.ProductV2 = Categories.hasOne(ProductV2, { foreignKey: 'categoryId', as: 'category' })
// ProductV2.belongsTo(Categories, { foreignKey: 'categoryId' })

// Categories.ProductV2 = Categories.hasOne(ProductV2, { foreignKey: 'subCategoryId', as: 'subCategory' })
// ProductV2.belongsTo(Categories, { foreignKey: 'subCategoryId' })


ProductV2.belongsTo(Categories, { foreignKey: 'categoryId', as: 'category' });
ProductV2.belongsTo(Categories, { foreignKey: 'subCategoryId', as: 'subCategory' });
