const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

//Points keeping in-memory, for turning id to points
const pointsStore = new Map();

//Score keeping
function calculatePoints(receipt) {
  let points = 0;

  //Adding one point per letter in Company name
  const alnumMatches = receipt.retailer.match(/[A-Za-z0-9]/g) || [];
  points += alnumMatches.length;

  //Turning total into cents
  const total = parseFloat(receipt.total);
  const cents = Math.round(total * 100);

  //Adding 50 points if total is a full dollar
  if (cents % 100 === 0) points += 50;

  //Adding 25 points if total ends in .25 
  if (cents % 25 === 0) points += 25;

  //Adding 5 points for every 2 items
  points += Math.floor(receipt.items.length / 2) * 5;

  //For when we trim item description and see if multiple of 3
  receipt.items.forEach(item => {
    const desc = item.shortDescription.trim();
    if (desc.length % 3 === 0) {
      const price = parseFloat(item.price);
      points += Math.ceil(price * 0.2);
    }
  });

  //If the purchase day is odd, we add 6 points
  const [year, month, day] = receipt.purchaseDate.split('-').map(Number);
  if (day % 2 === 1) points += 6;

  //If time is between 14:00 and 16:00 we add 10 points
  const [hour, minute] = receipt.purchaseTime.split(':').map(Number);
  if (hour >= 14 && hour < 16) points += 10;

  return points;
}

//POST /receipts/process
app.post('/receipts/process', (req, res) => {
  const receipt = req.body;
  const id = uuidv4();
  const pts = calculatePoints(receipt);
  pointsStore.set(id, pts);

  res.json({id});
});

//GET /receipts/:id/points
app.get('/receipts/:id/points', (req, res) => {
  const id = req.params.id;
  if (!pointsStore.has(id)) {
    return res.status(404).json({ message: 'Receipt not found' });
  }
  const points = pointsStore.get(id);
  res.json({points});
});

//Starting server and making port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});