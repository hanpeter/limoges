FROM node:fermium

# Set up working directory
WORKDIR /limoges

# Install app dependencies
# XXX: Copy only package.json & package-lock.json first to take
#      advantage of Docker build cache
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Run the server
ENTRYPOINT [ "npm", "start" ]
