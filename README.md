# gh-label-svg

A microservice for SVG GitHub label images

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/rtsao/gh-label-svg)

## Why?
I wanted to embed GitHub labels into GitHub markdown previews, but arbitrary HTML/CSS isn't supported. This service renders equivalent labels via pure SVG, which can be embedded into GitHub-flavored markdown as images.

## Examples

`https://gh-label-svg.now.sh/label.svg?color=5E35B1&text=super%20cool`

![example label](https://gh-label-svg.now.sh/label.svg?color=5E35B1&text=super%20cool)

`https://gh-label-svg.now.sh/label.svg?color=1976D2&text=microservice`

![example label](https://gh-label-svg.now.sh/label.svg?color=1976D2&text=microservice)

`https://gh-label-svg.now.sh/label.svg?color=E64A19&text=wow`

![example label](https://gh-label-svg.now.sh/label.svg?color=E64A19&text=wow)
