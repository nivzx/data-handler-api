const { ransac } = require("./ransac");
const { sendPostRequest } = require('./blockchainApi');

exports.cluster = async function(array) {
  const roundedArray = array.map(obj => ({
    lat: parseFloat(obj.lat.toFixed(3)),
    long: parseFloat(obj.long.toFixed(3)),
    level: obj.level
  }));

  const groupedArrays = {};
  roundedArray.forEach(obj => {
    const key = `${obj.lat.toFixed(3)}_${obj.long.toFixed(3)}`; // Concatenate rounded values
    if (!groupedArrays[key]) {
      groupedArrays[key] = [];
    }
    groupedArrays[key].push(obj.level); // Push signal level to the array
  });

  const result = Object.entries(groupedArrays).map(([key, levels]) => ({
    [key]: levels
  }));

  result.forEach(async (item) => {
    argsArray=[];
    const aggregatedValue = await ransac(Object.values(item)[0]);

    argsArray[0] = Object.keys(item)[0];
    argsArray[1] = aggregatedValue.toString();

    await sendPostRequest(argsArray);
  });
};
