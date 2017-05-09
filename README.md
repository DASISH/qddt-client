# QDDT Client

[![Build Status](https://travis-ci.org/DASISH/qddt-client.svg?branch=devel)](https://travis-ci.org/DASISH/qddt-client)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

*This is a prototype for the web client based on the QDDT API being developed at NSD. This prototype uses Angular 2.0.0 releases.*

## Sites

[QDDT Prod](https://qddt.nsd.no)

[QDDT Test/Dev](http://qddt-test.nsd.no)

## Demo

[QDDT Client](http://dasish.github.io/qddt-client/)

## Basic features:

- [x] Login and logout
- [x] A dashboard
- [x] Support survey programs, study, category, concept, response domains and question constructs
- [x] See comments
- [x] See revisions
- [x] A better workflow

## How to start

```bash
# install the project's dependencies
npm install
# watches your files and uses livereload by default
npm start

# dev build
npm run build.dev
# prod build
npm run build.prod
```
## How to publish github page
```bash
#checkout devel branch, say directory path A
npm run build.prod -- --base=/qddt-client/ --api=https://qddt-test.nsd.no/api/

#checkout gh-pages branch , say directory path B
cp -a A/dist/prod/* B/

#goto B and commit the webpage to gh-pages
git add *
git commit -m "message"
git push
```

## Configuration

### Default application server configuration

```javascript
var PORT             = 5555;
var APP_BASE         = '/';
```

### Configure at runtime

```bash
npm start -- --port 8080 --reload-port 4000 --base /my-app/
```
```bash
npm test
```

## License

MIT

## Credits

Based on https://github.com/mgechev/angular2-seed/  
We will follow changes here as well, and implement big changes to our tool chain as they appear.
