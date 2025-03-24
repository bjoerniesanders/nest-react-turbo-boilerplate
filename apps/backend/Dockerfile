
    FROM node:22-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    
    RUN yarn install
    
    COPY . .
    
    RUN yarn build
    
    
    FROM node:22-alpine
    
    WORKDIR /app
    
    COPY --from=builder /app/package*.json ./
    
    RUN yarn install --production --frozen-lockfile

    RUN yarn cache clean

    COPY --from=builder /app ./

    COPY entrypoint.sh ./
    RUN chmod +x entrypoint.sh
    
    EXPOSE 3000
    
    CMD ["./entrypoint.sh"]
    