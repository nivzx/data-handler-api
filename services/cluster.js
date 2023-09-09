const { ransac } = require('./ransac')
const { sendPostRequest } = require('./blockchainApi')
const axios = require('axios')

exports.cluster = async function (array) {
  const roundedArray = array.map((obj) => ({
    lat: parseFloat(obj.lat.toFixed(3)),
    long: parseFloat(obj.long.toFixed(3)),
    level: obj.level,
  }))

  const groupedArrays = {}
  roundedArray.forEach((obj) => {
    const key = `${obj.lat.toFixed(3)}_${obj.long.toFixed(3)}` // Concatenate rounded values
    if (!groupedArrays[key]) {
      groupedArrays[key] = []
    }
    groupedArrays[key].push(obj.level) // Push signal level to the array
  })

  const result = Object.entries(groupedArrays).map(([key, levels]) => ({
    [key]: levels,
  }))

  const asyncTasks = result.map(async (item) => {
    const aggregatedValue = await ransac(Object.values(item)[0])
    const argsArray = [Object.keys(item)[0], aggregatedValue.toString()]

    if (aggregatedValue > -30) {
      await sendNotificationRequest({ location: argsArray[0] })
    }

    await sendPostRequest(argsArray)
  })

  await Promise.all(asyncTasks)
}

async function sendNotificationRequest(body) {
  try {
    const response = await axios.post(
      'http://localhost:3000/send-notifications',
      body
    )
    console.log('Notificatoin request sent successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error sending notification request:', error)
    throw error
  }
}
