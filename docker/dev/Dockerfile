# Use Node.js
FROM node:20-alpine

# Set working folder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install packages
RUN npm install

# Copy project
COPY . .

# Open port
EXPOSE 3000

# Run Next.js dev server
CMD ["npm", "run", "dev"]