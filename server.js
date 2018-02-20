const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/mongo-app');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('db connected');
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const kittySchema = mongoose.Schema({
  name: String,
  age: Number,
  adopted: String,
  toys: Array,
});

// instance methods must be added before compiled with mongoose.model()
// must use function declaration syntax for proper `this` scoping
kittySchema.methods.speak = function s() {
  const message = `${this.name} is ${this.age} years old.`;
  console.log(message);
};

const Kitten = mongoose.model('Kitten', kittySchema);
const sample = new Kitten({ name: 'does this work>' });
sample.speak();

app.get('/', (req, res) => {
  Kitten.find((err, kittens) => {
    if (err) return console.error(err);
    return res.render('index.ejs', { kittens });
  });
});

app.post('/kittens', (req, res) => {
  const newKitten = new Kitten(req.body);
  newKitten.save((err, result) => {
    if (err) return console.error(err);
    newKitten.speak();
    return res.redirect('/');
  });
});

app.listen(4000, () => {
  console.log('listening on 4000');
});
