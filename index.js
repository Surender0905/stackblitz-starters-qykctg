const express = require('express');
let cors = require('cors');

const app = express();
const port = 3010;

app.use(cors());

let cartItems = [
  { productId: 1, name: 'Laptop', price: 50000, quantity: 1 },
  { productId: 2, name: 'Mobile', price: 20000, quantity: 2 },
];

// Function to add a new item to the cart
function addItemToCart(productId, name, price, quantity) {
  const newItem = {
    productId: parseInt(productId),
    name,
    price: parseFloat(price),
    quantity: parseInt(quantity),
  };
  cartItems.push(newItem);
}

// Endpoint to add an item to the cart
app.get('/cart/add', (req, res) => {
  const { productId, name, price, quantity } = req.query;

  if (!productId || !name || !price || !quantity) {
    return res.status(400).json({
      error:
        'All query parameters (productId, name, price, quantity) are required',
    });
  }

  addItemToCart(productId, name, price, quantity);

  res.json({ cartItems });
});

function editItemQuantity(productId, quantity) {
  const item = cartItems.find((item) => item.productId === parseInt(productId));
  if (item) {
    item.quantity = parseInt(quantity);
  }
}

// Endpoint to edit quantity of an item in the cart
app.get('/cart/edit', (req, res) => {
  const { productId, quantity } = req.query;

  if (!productId || !quantity) {
    return res.status(400).json({
      error: 'Both productId and quantity query parameters are required',
    });
  }

  editItemQuantity(productId, quantity);

  res.json({ cartItems });
});

function deleteItemFromCart(productId) {
  cartItems = cartItems.filter(
    (item) => item.productId !== parseInt(productId)
  );
}

app.get('/cart/delete', (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res
      .status(400)
      .json({ error: 'productId query parameter is required' });
  }

  deleteItemFromCart(productId);

  res.json({ cartItems });
});

function getCartItems() {
  return cartItems;
}
// Endpoint to read items in the cart
app.get('/cart', (req, res) => {
  const items = getCartItems();
  res.json({ cartItems: items });
});

function calculateTotalQuantity() {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

// Endpoint to calculate total quantity of items in the cart
app.get('/cart/total-quantity', (req, res) => {
  const totalQuantity = calculateTotalQuantity();
  res.json({ totalQuantity });
});

function calculateTotalPrice() {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

// Endpoint to calculate total price of items in the cart
app.get('/cart/total-price', (req, res) => {
  const totalPrice = calculateTotalPrice();
  res.json({ totalPrice });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
