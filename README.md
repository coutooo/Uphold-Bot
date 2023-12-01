# Uphold Bot

Uphold Bot is a Node.js application that monitors cryptocurrency prices and triggers alerts based on specified conditions. It uses PostgreSQL as its database to store alerts.


------Requirements------
npm install axios
npm install commander
npm install --save-dev jest
npm install pg-promise

Install PostgreSQL
(Optional) Docker

------------------------


------------Docker------------
Modify command arguments in the Dockerfile, as you wish:

CMD [ "node", "upholdbot.js", "-c", "XRP-USD,BTC-USD,ETH-USD", "-i", "5000,10000,7000", "-p", "0.01,0.05,0.03" ]

Build the Docker image:
docker build -t uphold-bot .

Start the Docker containers:
sudo docker-compose up --build

If no logs appear, open another terminal and type:
sudo docker-compose logs -f uphold-bot

To query the alerts table in the PostgreSQL database:
sudo docker exec -it upholdbot-db-1 psql -U upholdb -d upholdb
SELECT * FROM alerts;

To stop and remove the containers:
sudo docker-compose down

------------------------------------#Arguments instructions---------------------------------------------------------

-c, --currencyPairs <pairs>', 'Comma-separated list of currency pairs', 'BTC-USD,ETH-USD,XRP-USD'
-i, --fetchIntervals <intervals>', 'Comma-separated list of fetch intervals in milliseconds', '5000'
-p, --priceOscillations <percentages>', 'Comma-separated list of price oscillation percentages for alerts', '0.01'
-------------------------------------------------------------------------------------------------------------------

--------------------------------------RUN (without docker)--------------------------------
in PostgreSQL

CREATE DATABASE upholdb;

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    currency_pair VARCHAR(10),
    rate_change_percentage NUMERIC,
    alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    configuration JSON
);

change this line accordingly in upholdbot.js:
const db = pgp('postgres://upholdb:upholdb@localhost:5432/upholdb'); // Replace with your PostgreSQL connection details

node upholdbot.js -c <pairs> -i <intervals> -p <percentages>

example: node upholdbot.js -c XRP-USD,BTC-USD,ETH-USD -i 5000,10000,7000 -p 0.01,0.05,0.03
-------------------------------------------------------------------------

------TEST (jest)----------
 npm test
--------------------------




