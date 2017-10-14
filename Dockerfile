FROM library/node:8.6.0

LABEL name "gh-label-svg"

RUN apt-get update && apt-get install -y \
    unzip\
    p7zip-full\
    cpio

RUN curl -o SFPro.zip https://developer.apple.com/fonts/downloads/SFPro.zip
RUN unzip -o SFPro.zip "SFPro/San Francisco Pro.pkg" -d .
RUN 7z x "SFPro/San Francisco Pro.pkg" "San Francisco Pro.pkg/Payload"
RUN cat "San Francisco Pro.pkg/Payload" | gunzip -dc | cpio -idv "./Library/Fonts/SF-Pro-Text-Semibold.otf"

RUN mkdir /app

RUN mv ./Library/Fonts/SF-Pro-Text-Semibold.otf app/

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY index.js /app

EXPOSE 8000
CMD ["npm", "start"]
