FROM node:10.0.0-slim
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the application
COPY /dist ./

# Execute the application
EXPOSE 3000
CMD [ "node", "main.js" ]
