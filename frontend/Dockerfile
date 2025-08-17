# Use Node.js image to compile TypeScript
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy all frontend files (including index.html)
COPY . .

# Compile TypeScript to JavaScript (output will be in 'dist')
RUN npx tsc

# Copy index.html to dist folder after TypeScript compilation
RUN cp index.html dist/

# Expose port 8080 for serving the frontend
EXPOSE 8080

# Use a simple HTTP server to serve the static files from the 'dist' folder
CMD ["npx", "http-server", "dist", "-p", "8080"]
