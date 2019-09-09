const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

const Item = require('./models/items.js');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/items', {useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', ()=> {
  console.log('Connected to the Mongodb database...');
});

const itemRoutes = express.Router();
app.use('/items', itemRoutes);

itemRoutes.route('/').get((req, res) => {
    Item.find({}, (err, items) => {
        if (err) {
            console.log(err);
        } else {
            res.json(items);
        }
    });
});

itemRoutes.route('/:id').get((req, res) => {
  Item.findById(req.params.id, (error, foundItem) => {
    res.json(foundItem);
  });
});

itemRoutes.route('/add').post((req, res) => {
  Item.create(req.body, (error, createdItem) => {
    res.status(200).json(createdItem);
  });
});

itemRoutes.route('/update/:id').post((req, res) => {
  Item.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, updatedItem) => {
    res.json(updatedItem);
  });
});

itemRoutes.route('/:id').delete((req, res) => {
  Item.findByIdAndRemove(req.params.id, (error, deletedItem) => {
    res.json(deletedItem);
  })
})

app.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
});
