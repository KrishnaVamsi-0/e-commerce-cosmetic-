const Product = require("../models/product");

// 🔹 Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Single Product
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👑 Admin - Create Product
const createProduct = async (req, res) => {
  try {
    const { name, brand, description, category, price, stock, image } = req.body;

    const product = await Product.create({
      name,
      brand,
      description,
      category,
      price,
      stock,
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
};
