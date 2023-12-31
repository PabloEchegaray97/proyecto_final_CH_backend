import ProductDTO from '../DAO/DTO/product.dto.js'

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }
    getProducts = async (req) => {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const { sort, priceMin, priceMax } = req.query;
        const filter = {};
        let priceQuery = '';
        let sortOption = 'price';
        if (priceMin !== undefined && priceMax !== undefined) {
            filter.price = { $gte: parseInt(priceMin), $lte: parseInt(priceMax) };
            priceQuery = `&priceMin=${priceMin}&priceMax=${priceMax}`
        } else if (priceMin !== undefined) {
            filter.price = { $gte: parseInt(priceMin) };
            priceQuery = `&priceMin=${priceMin}`

        } else if (priceMax !== undefined) {
            filter.price = { $lte: parseInt(priceMax) };
            priceQuery = `&priceMax=${priceMax}`
        }
        if (parseInt(sort) === -1) {
            sortOption = '-price';
        }
        const query = {filter, page, limit, sortOption, priceQuery}
        return await this.dao.getProducts(query)
    }
    getProductById = async (id) => {
        return await this.dao.getProductById(id)
    }
    createProduct = async (product) => {
        const newProduct = new ProductDTO(product)
        return await this.dao.createProduct(newProduct)
    }
    updateProduct = async (id, product) => {
        return await this.dao.updateProduct(id, product)
    }
    deleteProduct = async (id) => {
        return await this.dao.deleteProduct(id)
    }
    productOwner = async (product, method, newProduct, userId) => {
        //const update = { ...newProduct, owner: userId };
        const createProductData = (method === 'create' || method === 'update') ? { ...newProduct, owner: userId, _id: undefined } : { ...newProduct, owner: userId };
        const isOwner = product.owner == userId;
        console.log(isOwner);
        if (method=='delete' && isOwner) {
            return await this.dao.deleteProduct(product._id)
        } else if (method=='update' && isOwner) {
            return await this.dao.updateProduct(product._id, createProductData)
        } else if (method == 'create') {
            return await this.dao.createProduct(createProductData)
        }
        return null
    }
}