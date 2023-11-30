const axios = require('axios');
const program = require('commander');

  program
  .option('-c, --currencyPairs <pairs>', 'Comma-separated list of currency pairs', 'BTC-USD,ETH-USD,XRP-USD')
  .option('-i, --fetchIntervals <intervals>', 'Comma-separated list of fetch intervals in milliseconds', '5000')
  .option('-p, --priceOscillations <percentages>', 'Comma-separated list of price oscillation percentages for alerts', '0.01')
  .parse(process.argv);

// Parse the currency pairs

const options = program.opts();

const currencyPairs = options.currencyPairs ? options.currencyPairs.split(',') : [];
const fetchIntervals = options.fetchIntervals ? options.fetchIntervals.split(',') : [];
const priceOscillations = options.priceOscillations ? options.priceOscillations.split(',') : [];
const apiUrl = 'https://api.uphold.com/v0/ticker/';
const lastRates = {};
const currencyInterval = {};
const currencyOscillations = {};

// check if all arguments have the same size
if (currencyPairs.length !== fetchIntervals.length || currencyPairs.length !== priceOscillations.length) {
    console.error('The number of currency pairs, fetch intervals and price oscillations must be the same.');
    console.log('options: ', options);
    process.exit(1);
}

// for each currency set the interval and oscillation
currencyPairs.forEach((currencyPair, index) => {
    currencyInterval[currencyPair] = fetchIntervals[index];
    currencyOscillations[currencyPair] = priceOscillations[index];
});

function fetchTickerData(currencyPair) {
    axios.get(apiUrl + currencyPair)
        .then(response => {
            const tickerData = response.data;
            const currentRate = tickerData.ask;

            console.log(`Current ${currencyPair} rate: ${currentRate}`);

            if (lastRates[currencyPair] !== undefined) {
                const rateChangePercentage = calculatePercentageChange(lastRates[currencyPair], currentRate);

                if (Math.abs(rateChangePercentage) >= currencyOscillations[currencyPair]) {
                    // ALERT print to changes bigger/smaller than priceOscillations
                    console.log('➡️ ➡️ ➡️ ➡️ ➡️ ➡️ ➡️   ALERT    ')
                    console.log(`➡️  ${currencyPair} Rate changed by ${rateChangePercentage.toFixed(2)}% `); // ⬅️⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️
                    console.log('➡️ ➡️ ➡️ ➡️ ➡️ ➡️ ➡️   ALERT    ')
                }
            }

            // Update the last rate
            lastRates[currencyPair]  = currentRate;

            // Schedule the next fetch
            //setTimeout(fetchTickerData, fetchIntervals);
        })
        .catch(error => {
            console.error('Error fetching ticker data:', error.response ? error.response.data : error.message);
            // Retry after the fetch interval in case of an error
            setTimeout(fetchTickerData, currencyInterval[currencyPair]);
        });
}

function calculatePercentageChange(oldValue, newValue) {
    return ((newValue - oldValue) / oldValue) * 100;
}

// Start fetching ticker data for each currency pair
currencyPairs.forEach(currencyPair => {
    setInterval(() => fetchTickerData(currencyPair), currencyInterval[currencyPair]);
});

