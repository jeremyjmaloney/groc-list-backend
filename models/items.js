const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Item = new Schema({
  item_description: {type: String, required: true},
  item_priority: {type: String},
  item_completed: {type: Boolean}
});

module.exports = mongoose.model('Item', Item);
