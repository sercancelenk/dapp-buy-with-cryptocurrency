import React, {useState, useEffect} from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000';


function Store({paymentProcessor, dai}){
    const buy = async product => {
        const paymentIdResponse = await axios.get(`${API_URL}/api/getPaymentId/${product.productId}`);
        const approveTransaction = await dai.approve(paymentProcessor.address, product.price);
        await approveTransaction.wait();

        const payTransaction = await paymentProcessor.pay(product.price, paymentIdResponse.data.paymentId);
        await payTransaction.wait();

        const paymentData = {
            productId: product.productId,
            productName: product.productName,
            paymentId: paymentIdResponse.data.paymentId,
            tx: payTransaction.hash
        }
        const savePaymentResponse = await axios.post(`${API_URL}/api/savePayment`, paymentData);

        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const [products, setProducts] = useState([]);
    useEffect(() => {
        const init = async () => {
            const resp = await axios.get(`${API_URL}/api/products`);
            setProducts(resp.data);
        };
        init();
      }, [])

    return (
        <table className='table table-hovered'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    Array.from(products).map(product => {
                        return (
                            <tr key={product.productId}>
                                <td>{product.productId}</td>
                                <td>{product.productName}</td>
                                <td>{product.price} DAI</td>
                                <td>
                                <button
                                    type='button'
                                    style = {{float: 'right'}}
                                    className='btn btn-primary'
                                    onClick={()=> buy(product)}
                                >
                                        Buy
                                </button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}

export default Store;
