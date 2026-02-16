const Cart = require("../models/Cart");
const Product = require("../models/product");

/* =========================================================
   @desc    Get user cart
   @route   GET /api/cart
   @access  Private
========================================================= */
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    if (!cart) {
      return res.json({ products: [], totalAmount: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   @desc    Add item to cart
   @route   POST /api/cart
   @access  Private
========================================================= */
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "ProductId and quantity required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        products: [],
        totalAmount: 0,
      });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += Number(quantity);
    } else {
      cart.products.push({
        product: productId,
        quantity: Number(quantity),
        priceSnapshot: product.price, // 🔐 Secure price from DB
      });
    }

    // Recalculate totalAmount
    cart.totalAmount = cart.products.reduce(
      (sum, item) => sum + item.quantity * item.priceSnapshot,
      0
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   @desc    Update cart item quantity
   @route   PUT /api/cart/:productId
   @access  Private
========================================================= */
const updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ message: "Quantity required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === req.params.productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    cart.products[productIndex].quantity = Number(quantity);

    // Recalculate totalAmount
    cart.totalAmount = cart.products.reduce(
      (sum, item) => sum + item.quantity * item.priceSnapshot,
      0
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   @desc    Remove item from cart
   @route   DELETE /api/cart/:productId
   @access  Private
========================================================= */
const removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== req.params.productId
    );

    // Recalculate totalAmount
    cart.totalAmount = cart.products.reduce(
      (sum, item) => sum + item.quantity * item.priceSnapshot,
      0
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
};
