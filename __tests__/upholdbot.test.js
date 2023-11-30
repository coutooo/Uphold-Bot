const axios = require('axios');
const upholdbot = require('../upholdbot');

jest.mock('axios');

// Set a timeout for the entire test suite
jest.setTimeout(30000); // Adjust the timeout as needed

beforeAll(() => {
    jest.useFakeTimers();
});
afterAll(() => {
    jest.useRealTimers();
});

describe('fetchTickerData', () => {
  it('fetches successfully data from an API', async () => {
    const currencyPair = 'BTC-USD';
    const fetchIntervals = '5000';
    const priceOscillations = '0.01';
    const mockResponse = { data: { ask: 100 } };

    axios.get.mockResolvedValue(mockResponse);

    const result = await upholdbot.fetchTickerData(
      currencyPair,
      fetchIntervals,
      priceOscillations
    );

    expect(result).toEqual(mockResponse.data.ask);
  });

  it('handles errors when fetching data', async () => {
    const currencyPair = 'BTC-USD';
    const fetchIntervals = '5000';
    const priceOscillations = '0.01';
    const errorMessage = 'Failed to fetch data';
    axios.get.mockRejectedValue(new Error(errorMessage));

    try {
      await upholdbot.fetchTickerData(
        currencyPair,
        fetchIntervals,
        priceOscillations
      );
    } catch (error) {
      expect(error).toEqual(errorMessage);
    }
  });
});

// Additional test for setInterval
describe('setInterval for fetchTickerData', () => {
  it('calls fetchTickerData at regular intervals', () => {
    jest.useFakeTimers();

    const currencyPair = 'BTC-USD';
    const fetchIntervals = '5000';
    const priceOscillations = '0.01';

    upholdbot.fetchTickerData = jest.fn();

    const intervalId = setInterval(() => {
      upholdbot.fetchTickerData(currencyPair, fetchIntervals, priceOscillations);
    }, fetchIntervals);

    jest.advanceTimersByTime(6000); // Advance timers by 6 seconds

    expect(upholdbot.fetchTickerData).toHaveBeenCalledTimes(1);

    // Clear the interval after the test is complete
    clearInterval(intervalId);
    jest.clearAllTimers();
    
  });
});
