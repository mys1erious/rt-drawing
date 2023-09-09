FROM node:18.17.1-slim

WORKDIR /src

RUN apt-get update &&  \
    apt-get install -y unzip curl &&  \
    apt-get clean &&  \
    rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

COPY package*.json ./
RUN bun install

COPY . .

# RUN bun run build
# CMD ["bun", "start"]
