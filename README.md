# CuriousGeorge 0.0.1

`CuriousGeorge` is ES6 class which helps to getting CloudSponge email provider. 

## Setup 

Clone the repo and execute

```
npm install 
```

## Compiling ES6 with source maps

```
babel src/index.js --out-file build/curious-george.js --source-maps
```

## Usage

```javascript
var cg = new CuriousGeorge();

cg.findProvider('test@arizonabay.com')
.then(function (result) {
   console.log(result);
})
.catch(function (err) {
    console.log(err);
})
```

## Raw JSON 

```javascript
var cg = new CuriousGeorge();

cg.lookup('test@arizonabay.com')
.then(function (result) {
   console.log(result);
})
.catch(function (err) {
    console.log(err);
})
```
