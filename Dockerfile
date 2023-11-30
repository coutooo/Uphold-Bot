# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the SQL file to the container
COPY init.sql /docker-entrypoint-initdb.d/

# Copy the application code to the container
COPY . .

# Define the command to run your application
CMD [ "node", "upholdbot.js", "-c", "XRP-USD,BTC-USD,ETH-USD", "-i", "5000,10000,7000", "-p", "0.01,0.05,0.03" ]
