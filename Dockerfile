# Fase de build
FROM node:22-alpine AS builder

# Define o diretório de trabalho na imagem
WORKDIR /app

# Copia o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Compila a aplicação Next.js para produção
RUN npm run build

# Fase de produção
FROM node:22-alpine AS production

# Define o diretório de trabalho na imagem
WORKDIR /app

# Copia as dependências e a build da fase anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Define a porta que o container vai expor
EXPOSE 3000

# Define a variável de ambiente de produção
ENV NODE_ENV=production

# Comando para iniciar a aplicação Next.js
CMD ["npm", "start"]
