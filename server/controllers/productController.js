const Product = require('../models/Product');

const checkStore = (req, res) => {
    if (!req.user.storeId) {
        res.status(400).json({ msg: 'User does not have a store.' });
        return false;
    }
    return true;
};

// GET all products, DIURUTKAN DARI HARGA TERMURAH
exports.getProducts = async (req, res) => {
    if (!checkStore(req, res)) return;
    try {
        // DIUBAH DI SINI: Mengurutkan berdasarkan harga (price: 1 artinya termurah dulu)
        const products = await Product.find({ storeId: req.user.storeId }).sort({ price: 1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// CREATE a new product
exports.createProduct = async (req, res) => {
    if (!checkStore(req, res)) return;
    const { name, price, stock, category } = req.body;
    try {
        const newProduct = new Product({
            name, price, stock, category,
            storeId: req.user.storeId
        });
        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// UPDATE a product
exports.updateProduct = async (req, res) => {
    if (!checkStore(req, res)) return;
    const { name, price, stock, category } = req.body;
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.storeId.toString() !== req.user.storeId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        product.name = name;
        product.price = price;
        product.stock = stock;
        product.category = category;
        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// DELETE a product
exports.deleteProduct = async (req, res) => {
    if (!checkStore(req, res)) return;
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.storeId.toString() !== req.user.storeId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await product.deleteOne();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};