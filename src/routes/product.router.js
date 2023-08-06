import { Router } from "express";
import productModel from '../DAO/mongoManager/models/product.model.js'
import cloudProductManager from "../DAO/mongoManager/controllers/product.manager.js";

const router = Router()

router.post('/', async (req, res) => {
    const productGenerated = await cloudProductManager.createProduct(req);
    res.redirect('/product/' + productGenerated._id)
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    await productModel.deleteOne({ _id: id })
    res.redirect('/product')
})

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const productNew = req.body;
        await productModel.findByIdAndUpdate(id, productNew);
        res.redirect('/product/' + id);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
});

export default router

