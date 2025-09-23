FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

WORKDIR /app

COPY --chown=nodeuser:nodejs package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

COPY --chown=nodeuser:nodejs . .

RUN mkdir -p /app/logs && \
    chown -R nodeuser:nodejs /app/logs

RUN rm -f .env* && \
    rm -f secrets.txt && \
    rm -f test-secrets.js

RUN apk add --no-cache dumb-init

USER nodeuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "app.js"]