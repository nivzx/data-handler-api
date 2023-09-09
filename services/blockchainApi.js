const axios = require('axios') // Make sure you have Axios installed

exports.sendPostRequest = async function (argsArray) {
  console.log('Writing to blockchain: ' + argsArray)
  const requestBody = {
    fcn: 'writeLevel',
    peers: ['peer0.org1.example.com', 'peer0.org2.example.com'],
    chaincodeName: 'level',
    channelName: 'mychannel',
    args: argsArray,
  }

  try {
    const response = await axios.post(
      'http://localhost:4000/channels/mychannel/chaincodes/level',
      requestBody
    )
    console.log('POST request sent successfully:', response.data)
  } catch (error) {
    console.error('Error sending data to the blockchian:', error.message)
  }
}
