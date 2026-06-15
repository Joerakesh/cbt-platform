# Use Node.js
FROM node:20-alpine

# Working folder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install packages
RUN npm install

# Copy project
COPY . .

# Build Next.js
RUN npm run build

# Open app port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]