const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const ethers = require('ethers');
const PaymentProcessor = require('../ecommerce-dapp-frontend/src/contracts/PaymentProcessor.json');
const {PurchasedItem, Product} = require('./db.js');
const bodyParser = require('body-parser');
const koaBody = require('koa-body');

const app = new Koa();
const router = new Router();

const initializeProducts = async () => {
    const items = [
        {productId: '1', productName: 'Product 1', price: ethers.utils.parseEther('100')},
        {productId: '2', productName: 'Product 2', price: ethers.utils.parseEther('150')},
        {productId: '3', productName: 'Product 3', price: ethers.utils.parseEther('160')},
    ]
    items.map(async (item) => {
        let query = {productId: item.productId};
        let update = {productId: item.productId, productName: item.productName, price: item.price};
        let options = {upsert: true, new: true, setDefaultsOnInsert: true};
        await Product.findOneAndUpdate(query, update, options);
    });
}

router.get('/api/products', async ctx => {
    const products = await Product.find();
    ctx.body = products;
})

router.get('/api/getPaymentId/:productId', async ctx => {
    const paymentId = (Math.random() * 10000).toFixed(0);
    ctx.body = {
        paymentId
    };
});

router.get('/api/purchasedItems', async ctx => {
    const purchasedItems = await PurchasedItem.find();
    ctx.body = purchasedItems === undefined ? [] : purchasedItems;
});

router.post('/api/savePayment', koaBody(),async (ctx) => {
    const {productId, productName, paymentId, tx} = ctx.request.body;

    if (!paymentId || !productId || !productName || !tx) ctx.throw(400, '.missing params');

    const purchasedItems = await PurchasedItem.create({
        productId: productId,
        productName: productName,
        paymentId: paymentId,
        tx: tx,
        paid: false
    });
    ctx.body = {status: 'OK'};
})

app.use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(bodyParser())
    .use(koaBody({
        jsonLimit: '1kb'
    }));

app.listen(4000, () => {
    console.log('server is running on 4000');
});

const listenToEvents = () => {
    console.log('listenEvents');
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:9545');
    const networkId = '5777';

    const paymentProcessor = new ethers.Contract(
        PaymentProcessor.networks[networkId].address,
        PaymentProcessor.abi,
        provider
    );

    paymentProcessor.on('PaymentDone', async (payer, amount, paymentId, date) => {

        console.log(`
            from ${payer}
            amount ${amount}
            paymentId ${paymentId}
            date ${new Date(date.toNumber() * 1000).toLocaleString()}
        `);

        let query = {paymentId: paymentId};
        let update = {
            payer: payer,
            amount: amount,
            paid: true,
            date: new Date(date.toNumber() * 1000).toLocaleString()
        };
        let options = {upsert: true, new: true, setDefaultsOnInsert: true};
        await PurchasedItem.findOneAndUpdate(query, update, options);
    });
};
initializeProducts();
listenToEvents();
