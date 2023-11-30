const axios = require('axios');
const program = require('commander');


program
  .option('-c, --currencyPairs <pairs>', 'Comma-separated list of currency pairs', 'BTC-USD,ETH-USD,XRP-USD')
  .option('-i, --fetchInterval <interval>', 'Fetch interval in milliseconds', parseInt, 5000)
  .option('-p, --priceOscillation <percentage>', 'Price oscillation percentage for alerts', parseFloat, 0.01)
  .parse(process.argv);

const currencyPairs = (program.currencyPairs || 'BTC-USD,ETH-USD,XRP-USD').split(',');
const fetchInterval = parseInt(program.fetchInterval) || 5000;
const priceOscillation = parseFloat(program.priceOscillation) || 0.01;
const apiUrl = 'https://api.uphold.com/v0/ticker/';
const lastRates = {};

function fetchTickerData(currencyPair) {
    axios.get(apiUrl + currencyPair)
        .then(response => {
            const tickerData = response.data;
            const currentRate = tickerData.ask;

            console.log(`Current ${currencyPair} rate: ${currentRate}`);

            if (lastRates[currencyPair] !== undefined) {
                const rateChangePercentage = calculatePercentageChange(lastRates[currencyPair], currentRate);

                if (Math.abs(rateChangePercentage) >= priceOscillation) {
                    // ALERT print to changes bigger/smaller than 0.01%
                    console.log('➡️ ➡️ ➡️ ➡️ ➡️ ➡️ ➡️   ALERT    ')
                    console.log(`➡️  ${currencyPair} Rate changed by ${rateChangePercentage.toFixed(2)}% `); // ⬅️⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️
                    console.log('➡️ ➡️ ➡️ ➡️ ➡️ ➡️ ➡️   ALERT    ')
                }
            }

            // Update the last rate
            lastRates[currencyPair]  = currentRate;

            // Schedule the next fetch
            //setTimeout(fetchTickerData, fetchInterval);
        })
        .catch(error => {
            console.error('Error fetching ticker data:', error.response ? error.response.data : error.message);
            // Retry after the fetch interval in case of an error
            setTimeout(fetchTickerData, fetchInterval);
        });
}

function calculatePercentageChange(oldValue, newValue) {
    return ((newValue - oldValue) / oldValue) * 100;
}

// Start fetching ticker data
//fetchTickerData();

// Start fetching ticker data for each currency pair
currencyPairs.forEach(currencyPair => {
    setInterval(() => fetchTickerData(currencyPair), fetchInterval);
  });
