FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY index.js .

# Expose port 3000
EXPOSE 3000

# Run the app
CMD [ "npm", "run","dev" ]
