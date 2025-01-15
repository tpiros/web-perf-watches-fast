import express, { Router } from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
const router = new Router();
const jsonParser = bodyParser.json();

const api = express();

const productList = [
  {
    id: 1,
    name: 'The Classic',
    price: 12_900,
    image: 'images/watch1.png',
    cloudinaryImage:
      'https://res.cloudinary.com/tamas-demo/image/upload/f_auto,q_auto/w_300,h_544/webperf2025/watch1',
  },
  {
    id: 2,
    name: 'The Navigator',
    price: 15_900,
    image: 'images/watch2.png',
    cloudinaryImage:
      'https://res.cloudinary.com/tamas-demo/image/upload/f_auto,q_auto/w_300,h_544/webperf2025/watch2',
  },
  {
    id: 3,
    name: 'The Chronometer',
    price: 18_900,
    image: 'images/watch3.png',
    cloudinaryImage:
      'https://res.cloudinary.com/tamas-demo/image/upload/f_auto,q_auto/w_300,h_544/webperf2025/watch3',
  },
];

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

router.get('/products', async (req, res) => {
  const products = productList.map((product) => ({ ...product }));
  products[random(0, products.length)].isPromo = true;
  return res.json(products);
});

router.get('/products/:id', async (req, res) => {
  const id = +req.params.id;
  const [product] = productList.filter((product) => product.id === id);
  return res.json(product);
});

const cartItems = [];
router.get('/cart/items', async (req, res) => {
  return res.json(cartItems);
});

router.post('/cart/items', jsonParser, async (req, res) => {
  const watch = req.body;
  cartItems.push(watch);
  return res.status(200).end();
});

api.use('/api', router);

export const handler = serverless(api);
