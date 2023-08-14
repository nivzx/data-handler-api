const axios = require('axios'); // Make sure you have Axios installed

exports.sendPostRequest = async function(argsArray) {
  console.log("Writingn to blockchain: " + argsArray)
  const requestBody = {
    fcn: 'writeLevel',
    peers: ['peer0.org1.example.com', 'peer0.org2.example.com'],
    chaincodeName: 'fabcar',
    channelName: 'mychannel',
    args: argsArray
  };

  try {
    const response = await axios.post('http://localhost:4000/channels/mychannel/chaincodes/fabcar', requestBody);
    console.log('POST request sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending POST request:', error.message);
  }
};
