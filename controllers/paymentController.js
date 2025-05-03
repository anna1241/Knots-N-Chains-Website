const axios = require('axios');
const crypto = require('crypto');

// @desc    Process JazzCash payment
// @route   POST /api/payments/jazzcash
// @access  Private
exports.jazzCashPayment = async (req, res) => {
  try {
    const { amount, orderId, phoneNumber } = req.body;
    
    const response = await axios.post('https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction', {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET',
      pp_Language: 'EN',
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_SubMerchantID: '',
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_BankID: '',
      pp_ProductID: '',
      pp_TxnRefNo: orderId,
      pp_Amount: amount * 100, // in paisa
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: new Date().toISOString(),
      pp_BillReference: orderId,
      pp_Description: `Payment for order ${orderId}`,
      pp_TxnExpiryDateTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      pp_ReturnURL: `${process.env.FRONTEND_URL}/payment-success`,
      pp_SecureHash: generateJazzCashHash(orderId, amount),
      ppmpf_1: phoneNumber,
      ppmpf_2: '',
      ppmpf_3: '',
      ppmpf_4: '',
      ppmpf_5: ''
    });
    
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Payment processing failed' });
  }
};

// @desc    Process EasyPaisa payment
// @route   POST /api/payments/easypaisa
// @access  Private
exports.easyPaisaPayment = async (req, res) => {
  try {
    const { amount, orderId, phoneNumber } = req.body;
    
    const response = await axios.post('https://easypay.easypaisa.com.pk/easypay/Index.jsf', {
      storeId: process.env.EASYPAISA_STORE_ID,
      amount: amount,
      postBackURL: `${process.env.BACKEND_URL}/api/payments/easypaisa-callback`,
      orderRefNum: orderId,
      expiryDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      merchantHashedReq: generateEasyPaisaHash(orderId, amount),
      mobileNum: phoneNumber,
      emailAddress: req.user.email
    });
    
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Payment processing failed' });
  }
};

// Helper functions
function generateJazzCashHash(orderId, amount) {
  const str = `${process.env.JAZZCASH_INTEGRITY_SALT}|${orderId}|${amount * 100}|PKR|`;
  return crypto.createHash('sha256').update(str).digest('hex');
}

function generateEasyPaisaHash(orderId, amount) {
  const str = `${process.env.EASYPAISA_STORE_ID}|${orderId}|${amount}|${process.env.EASYPAISA_HASH_KEY}`;
  return crypto.createHash('md5').update(str).digest('hex');
}