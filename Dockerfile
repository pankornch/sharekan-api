FROM node

# WORKDIR /app

COPY . .

# ENV POSTGRES_URI=postgres://postgres:admin@150.230.97.21:5432/sharekan

# ENV JWT_SECRET=b6e89843fea41091e5f7c0fc270eb91

RUN npm install

# RUN npm run build

EXPOSE 5000

CMD ["node", "index.js"]