const Dai = artifacts.require("Dai.sol");
const PaymentProcessor = artifacts.require("PaymentProcessor.sol");

module.exports = async function (deployer, network, addresses) {
    const [admin, payer, _] = addresses;
    console.log('network ' + network);

    if(network === 'develop') {
        await deployer.deploy(Dai);
        var dai;
        await Dai.deployed().then(function(instance){
            dai = instance;
            instance.faucet(payer, web3.utils.toWei('10000')).then(function(_){});
        });

        await deployer.deploy(PaymentProcessor, admin, dai.address);
        
    } else {
        const ADMIN_ADDRESS = '';
        const DAI_ADDRESS = '';
        await deployer.deploy(PaymentProcessor, ADMIN_ADDRESS, DAI_ADDRESS);
    }
};
