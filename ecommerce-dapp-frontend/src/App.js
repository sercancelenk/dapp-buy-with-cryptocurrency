import React, {useState, useEffect} from 'react';
import getBlockchain from './ethereum';
import Store from './Store.js';
import Purchases from './Purchases.js';

function App() {
  const [paymentProcessor, setPaymentProcessor] = useState(undefined);
  const [dai, setDai] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const {paymentProcessor, dai} = await getBlockchain();
      setPaymentProcessor(paymentProcessor);
      setDai(dai);
    };
    init();
  }, [])
  
  if(typeof window.ethereum === 'undefined'){
    return (
      <div className='container'>
        <div className='col-sm-12'>
          <h1>E-Commerce With Blockchain</h1>
          <p>You need to install the latest version of MetamASk</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container pt-5'>
      <div className='col-sm-12 text-center'>
        <h1 className='text-primary'>E-Commerce With Blockchain</h1>
        <Store paymentProcessor={paymentProcessor} dai={dai}></Store>
        <br/>
        <Purchases purchasedItems={[]}></Purchases>
      </div>
    </div>
  );
}

export default App;
