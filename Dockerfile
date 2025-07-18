# Use official Node.js LTS image
FROM node:20-slim

# Install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the application
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]