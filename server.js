const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const db = mongoose.connection;
const Item = require('./models/items.js');

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/items';
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

app.use(cors());
app.use(bodyParser.json());

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
  });
});

itemRoutes.route('/').delete((req, res) => {
  Item.deleteMany({}, (error, deletedList) => {
    res.json(deletedList);
  });
});

app.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
});
