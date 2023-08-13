FROM node:18
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install --save-dev vite
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]