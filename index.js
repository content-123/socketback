const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const books = []; // This should ideally be a database

app.post('/books', (req, res) => {
  const { title, author, price } = req.body;
  const book = { id: books.length + 1, title, author, price };
  books.push(book);
  res.status(201).send(book);
});

app.get('/books', (req, res) => {
  res.send(books);
});

app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const index = books.findIndex(book => book.id === parseInt(id));
  if (index !== -1) {
    books.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send({ message: 'Book not found' });
  }
});

const razorpay = new Razorpay({
  key_id: 'rzp_live_dCm4R9MkI9xyxZ',
  key_secret: 'X2JpHpQO5PTfIRxNcCy1FQYY',
});

app.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: 'INR',
  };
  try {
    const order = await razorpay.orders.create(options);
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/verify-payment', (req, res) => {
  // Implement payment verification
  res.send({ status: 'success' });
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
