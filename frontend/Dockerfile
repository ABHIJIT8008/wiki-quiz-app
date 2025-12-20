# Step 1: Build the React App
FROM node:22-alpine

WORKDIR /app

COPY package.json .
RUN npm install --legacy-peer-deps

COPY . .

# We expose port 5173 (Vite's default)
EXPOSE 5173

# Start the dev server with host=0.0.0.0 so Docker can see it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]