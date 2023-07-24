FROM node:18-alpine3.17

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . ./

# Expose port 3000
EXPOSE 3000

# Run the app
CMD [ "npm", "run", "dev" ]
