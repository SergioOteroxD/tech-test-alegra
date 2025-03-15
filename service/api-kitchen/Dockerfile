FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --production
RUN npm install -g typescript

COPY . .
# Compilar TypeScript a JavaScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]