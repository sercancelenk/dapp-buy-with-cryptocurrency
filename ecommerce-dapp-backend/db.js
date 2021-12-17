const mongoose = require('mongoose');

mongoose.connect(
    'mongodb://root:example@127.0.0.1:27017/ecommerdapp?authSource=admin&w=1',
    {useNewUrlParser: true, useUnifiedTopology: true}
);



const productSchema = new mongoose.Schema(
    {
        productId: String,
        productName: String,
        price: String
    }
);

const Product = mongoose.model('Product', productSchema);

const purchasedItemsSchema = new mongoose.Schema({
    productId: String,
    productName: String,
    paymentId: String,
    tx: String,
    payer: String,
    amount: String,
    date: String,
    paid: Boolean
});

const PurchasedItem = mongoose.model('PurchasedItem', purchasedItemsSchema);

module.exports = {
    Product,
    PurchasedItem
}
