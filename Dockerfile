FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

COPY . .

# Expose the port
EXPOSE 8000

CMD [ "npm","start" ]