curl -o SFPro.zip https://developer.apple.com/fonts/downloads/SFPro.zip
unzip -o SFPro.zip "SFPro/San Francisco Pro.pkg" -d .
xar -xf "SFPro/San Francisco Pro.pkg" --exclude Resources --exclude Distribution
cat "San Francisco Pro.pkg/Payload" | gunzip -dc | cpio -id "./Library/Fonts/SF-Pro-Text-Semibold.otf"
