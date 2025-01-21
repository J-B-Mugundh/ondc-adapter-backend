FROM node:alpine3.18
WORKDIR 
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start"]