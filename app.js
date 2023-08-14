const express = require('express');
const app = express();
const PORT = 33000; // You can change this to your desired port
const clusterService = require('./services/cluster'); // Import the cluster function

const dataQueue = []; // Array to collect incoming data
const MAX_DATA_COUNT = 5; // Maximum number of transactions to collect
const MAX_WAIT_TIME = 2 * 60 * 1000; // 2 minutes in milliseconds

app.use(express.json());

app.post('/incoming-data', (req, res) => {
  const { lat, long, level } = req.body;

  if (typeof lat === 'number' && typeof long === 'number' && typeof level === 'number') {
    console.log('Received JSON object:', req.body);

    // Add the incoming data to the array
    dataQueue.push(req.body);

    // Check if the maximum data count or wait time has been reached
    if (dataQueue.length >= MAX_DATA_COUNT || Date.now() >= dataQueue[0].timestamp + MAX_WAIT_TIME) {
      clusterService.cluster(dataQueue); // Call the cluster function with the collected data
      dataQueue.length = 0; // Clear the data array
    }

    res.status(200).json({ message: 'JSON object received successfully.' });
  } else {
    res.status(400).json({ error: 'Invalid JSON object format.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
