const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerId: {
       type: mongoose.SchemaTypes.ObjectId,
       require: true
     },
     bookId: {
       type: mongoose.SchemaTypes.ObjectId,
       require: true
     },
     initialDate: {
        type: Date,
        require: true
     },
     deliveryDate: {
        type: Date,
        require: false
     }
})

const Order = mongoose.model("order", orderSchema);

module.exports = Order;