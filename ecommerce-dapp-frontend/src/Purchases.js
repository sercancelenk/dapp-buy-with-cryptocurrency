import React, {useState, useEffect} from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

function Purchases(){
    const [purchasedItems, setPurchasedItems] = useState({
        purchasedItems: []
    });
    useEffect(() => {
        const init = async () => {
            const resp = await axios.get(`${API_URL}/api/purchasedItems`);
            setPurchasedItems(resp.data);
        };
        init();
      }, [])
      
    return (
        <table className='table table-stripped'>
            <thead>
                <tr>
                <th>Product Id</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Payer</th>
                <th>Date</th>
                </tr>
            </thead>
            <tbody>
            {Array.from(purchasedItems).map((item, index) => {
                return (
                    <tr key={index}>
                    <td>{item.productId}</td>
                    <td>{item.productName}</td>
                    <td>{item.amount} DAI</td>
                    <td>{item.payer}</td>
                    <td>{item.date}</td>
                    </tr>
                );
            })}    
            </tbody>
        </table>
    );
}

export default Purchases;