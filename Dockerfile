# https://www.youtube.com/watch?v=4q3br8jRSz4
# https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c

FROM node:slim as development

# The src directory is available after COPY, us it as WORKDIR.
WORKDIR /usr/src/app

# explicitly COPY the package files to store seperate in cache
COPY package*.json .

# Install the NPM deps.
RUN npm install

# COPY all the files in current directory to the container
COPY . .

# Compile the TS
RUN npm run build

# Define production container with compiled src code
FROM node:slim as production


# ARG NODE_ENV=production 
# ENV NODE_ENV=${NODE_ENV}

# The src directory is available after COPY, us it as WORKDIR.
WORKDIR /usr/src/app

# explicitly COPY the package files to store seperate in cache
COPY package*.json .

RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Start the application 
CMD node index.js