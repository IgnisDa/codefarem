FROM {{ IMAGE_NAME }}
WORKDIR /app
COPY apps/website/ci/* ./
COPY apps/website/build/* ./
COPY apps/website/public ./public
COPY node_modules ./node_modules
ENV NODE_ENV=production

CMD /app/start.sh
