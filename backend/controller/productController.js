import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//fetches the products, 
//GET / api / products public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});


//fetches a product, 
//GET / api / products /:id public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

//Create a products, 
//POST / api / products private/ ADMIN
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: 'images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })
    const createProduct = await product.save();
    res.status(201).json(createProduct);
});

//update the products, 
//PUT / api / product / :id private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updateProduct);
    } else {
        res.status(404);
        throw new Error('Resource not Found');
    }
});

//delete the products, 
//DELETE / api / product / :id         private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.status(200).json({ message: 'Product deleted' });
    } else {
        res.status(404);
        throw new Error('Resource not Found');
    }
});

//create products, 
//POST / api / product / :id /reviews        private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(404);
            throw new Error('Product already reviewed');

        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Resource not Found');
    }
});

export  {getProducts, getProductById , createProduct, updateProduct, deleteProduct, createProductReview};