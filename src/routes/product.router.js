import { Router } from "express";
import productModel from '../DAO/mongoManager/models/product.model.js'

const router = Router()


router.get('/', async (req, res) => {
    //const products = await productModel.find().lean().exec()
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const result = await productModel.paginate({}, {
        page,
        limit,
        lean: true
    })
    result.prevLink = result.hasPrevPage ? `/product/?page=${result.prevPage}&limit=${limit}` : ''
    result.nextLink = result.hasNextPage ? `/product/?page=${result.nextPage}&limit=${limit}` : ''
    console.log(result);
    
    res.render('list', result )

})

router.get('/create', async (req, res) => {
    res.render('create', {})
})

router.post('/create', async (req, res) => {
    const productNew = req.body
    console.log({ productNew })

    const productGenerated = new productModel(productNew)
    await productGenerated.save()



    console.log({ productGenerated });

    res.redirect('/product/' + productGenerated._id)
})

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id

    await productModel.deleteOne({ _id: id })
    res.redirect('/product')
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const product = await productModel.findById({ _id: id })
    console.log(product);
    res.render('one', product)
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

