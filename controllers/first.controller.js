const { Sequelize } = require('sequelize');
const models = require('../db/models')
const Joi = require('joi')
const formatJoiToForms = require('joi-errors-for-forms').form;
const Op = Sequelize.Op

/**
 * This function is used to fetch all the products from the database.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Object} The response object.
 * @author Vijay Patidar
 */
module.exports.getProducts = async (req, res) => {
    try {
        const body = req.query

        const allAttributes = Object.keys(models.ProductV2.rawAttributes)

        const validationSchema = Joi.object({
            currentPage: Joi.number().positive().default(1),
            pageSize: Joi.number().positive(),
            orderBy: Joi.string().default('createdAt'),
            orderDir: Joi.string().default('DESC').valid('ASC', 'DESC'),
            searchBy: Joi.string().default(''),
            searchFields: Joi.array().items(Joi.string().valid(...allAttributes))
        })

        const { error, value } = validationSchema.validate(body, {
            abortEarly: false
        })
        if (error) {
            const convertErrors = formatJoiToForms()
            const validationError = convertErrors(error)
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                response: validationError
            })
        }

        const offset = value.currentPage || 1
        const limit = value.pageSize || 10

        let searchCondition = {}

        if (value.searchBy) {
            if (value.searchFields && value.searchFields.length > 0) {
                searchCondition[Op.or] = value.searchFields.map(field => ({
                    [field]: { [Op.like]: `%${value.searchBy}%` },
                }))
            } else {
                searchCondition[Op.or] = [
                    searchCondition[Op.or] = allAttributes.map(field => ({
                        [field]: { [Op.like]: `%${value.searchBy}%` },
                    }))
                    // Sequelize.where(
                    //     Sequelize.fn('CONCAT', Sequelize.col('productName'), Sequelize.col('description')),
                    //     { [Op.like]: `%${value.searchBy}%` }
                    // ),
                ]
            }
        }
        const findAllProductOptions = {
            where: searchCondition,
            limit: limit,
            offset: (offset - 1) * limit,
            order: [[value.orderBy, value.orderDir]],
            nest: true,
            raw: true,
            include: [
                {
                    model: models.Categories,
                    attributes: ['categoryName'],
                    as: 'category',
                    required: false
                },
                {
                    model: models.Categories,
                    attributes: [['categoryName', 'subCategoryName']],
                    as: 'subCategory',
                    required: false
                },
                {
                    model: models.Organizations,
                    attributes: ['organizationId', ['orgName', 'organizationName'], ['orgLogoUrl', 'OrganizationLogoUrl']]
                },
                {
                    model: models.CustomerUOM,
                    attributes: [['description', 'uomDescription'], ['code', 'uomCode']]
                }
            ]
        }
        const products = await models.ProductV2.findAndCountAll(findAllProductOptions)

        return res.status(200).send({
            success: true,
            message: 'Data fetched successfully',
            response: {
                currentPage: findAllProductOptions.offset + 1,
                pageSize: findAllProductOptions.limit,
                totalPages: Math.ceil(products.count / findAllProductOptions.limit),
                totalCount: products.count,
                data: products.rows.map(product => ({
                    productId: product.productId,
                    productName: product.productName,
                    productImageName: product.productImagesName,
                    productImageURL: product.productImagesUrls,
                    brandName: product.brandName,
                    description: product.description,
                    itemCode: product.itemCode,
                    itemType: product.itemType,
                    currency: product.currency,
                    currencyCode: product.currencyCode,
                    saleAmount: product.saleAmount,
                    brochureFileName: product.broshureFileName,
                    brochureFileURL: product.broshureUrls,
                    vendors: product.vendors,
                    status: product.status,
                    createdBy: product.createdBy,
                    created: product.createdAt,
                    updated: product.updatedAt,
                    subCategoryId: product.subCategoryId,
                    categoryId: product.categoryId,
                    uomId: product.uomId,
                    shippingMethodId: product.shipingMethodId,
                    shippingTermsId: product.shippingTermId,
                    paymentTermsId: product.paymentTermId,
                    categoryName: product.category ? product.category.categoryName : null,
                    subCategoryName: product.subCategory ? product.subCategory.subCategoryName : null,
                    uomCode: product.CustomerUOM ? product.CustomerUOM.uomCode : null,
                    uomDescription: product.CustomerUOM ? product.CustomerUOM.uomDescription : null,
                    organizationName: product.Organization ? product.Organization.organizationName : null,
                    organizationId: product.Organization ? product.Organization.organizationId : null,
                    vendorInfo: product.Organization ? {
                        OrganizationId: product.Organization.organizationId,
                        CompanyName: product.Organization.organizationName,
                        OrganizationLogoUrl: product.Organization.OrganizationLogoUrl
                    } : null
                }))
            }
        })
    } catch (error) {
        console.log('Internal Server Error', error)
        return res.status(500).send({
            message: 'Internal Server Error',
            status: false
        })
    }
}

