# Uphold Bot

Uphold Bot is a Node.js application that monitors cryptocurrency prices and triggers alerts based on specified conditions. It uses PostgreSQL as its database to store alerts.

## Requirements

- `npm install axios`
- `npm install commander`
- `npm install --save-dev jest`
- `npm install pg-promise`
- Install PostgreSQL
- (Optional) Docker

## Docker

1. Modify command arguments in the Dockerfile:

    ```dockerfile
    CMD [ "node", "upholdbot.js", "-c", "XRP-USD,BTC-USD,ETH-USD", "-i", "5000,10000,7000", "-p", "0.01,0.05,0.03" ]
    ```

2. Build the Docker image:

    ```bash
    docker build -t uphold-bot .
    ```

3. Start the Docker containers:

    ```bash
    sudo docker-compose up --build
    ```

4. If no logs appear, open another terminal and type:

    ```bash
    sudo docker-compose logs -f uphold-bot
    ```

5. To query the alerts table in the PostgreSQL database:

    ```bash
    sudo docker exec -it upholdbot-db-1 psql -U upholdb -d upholdb
    SELECT * FROM alerts;
    ```

6. To stop and remove the containers:

    ```bash
    sudo docker-compose down
    ```

### Arguments Instructions

- `-c, --currencyPairs <pairs>`: Comma-separated list of currency pairs (e.g., 'BTC-USD,ETH-USD,XRP-USD').
- `-i, --fetchIntervals <intervals>`: Comma-separated list of fetch intervals in milliseconds (e.g., '5000').
- `-p, --priceOscillations <percentages>`: Comma-separated list of price oscillation percentages for alerts (e.g., '0.01').

## Running without Docker

1. In PostgreSQL:

    ```sql
    CREATE DATABASE upholdb;

    CREATE TABLE alerts (
        id SERIAL PRIMARY KEY,
        currency_pair VARCHAR(10),
        rate_change_percentage NUMERIC,
        alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        configuration JSON
    );
    ```

2. Change this line accordingly in upholdbot.js:

    ```javascript
    const db = pgp('postgres://upholdb:upholdb@localhost:5432/upholdb'); // Replace with your PostgreSQL connection details
    ```

3. Run the application:

    ```bash
    node upholdbot.js -c <pairs> -i <intervals> -p <percentages>
    ```

    Example:

    ```bash
    node upholdbot.js -c XRP-USD,BTC-USD,ETH-USD -i 5000,10000,7000 -p 0.01,0.05,0.03
    ```

## Testing (Jest)

```bash
npm test
