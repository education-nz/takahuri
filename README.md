# Takahuri
**Takahuri - a verb in Te Reo Maori meaning to convert, change, switch.**

A utility for creating bilingual content toggling with JavaScript.
Implemented in vanillaJS in a functional style.

## How does it work

## How to use Takahuri to support bilingual toggling on a web page
    
### Customisable
Out of the box Takahuri is designed to toggle between English and Te Reo Maori.
It's primary use case is to support bilingual content on ministry websites. 
However all the data tags used are customisable, 
meaning you could adapt the tool to support different languages (currently only bilingual toggling is supported).      
 
## Installation & Usage
### Installation
Takahuri can be installed from NPM `yarn add takahuri`

### Usage
Import into your main javascript package
 
```
import takahuri from 'takahuri';
   
takahuri();
``` 

Define toggle and bilingual content in html using the given data attributes (customisable).

```
<body class="$ClassName.Short.LowerCase"
      data-toggles="data-lang-active"
      data-lang-active="lang--en"
      data-lang-active-en="lang--en"
      data-lang-active-mi="lang--mi"
>
```

Takahuri will 

## Development
### Scripts
- __install dependencies__:
`yarn`

- __development build__:
`yarn build`
or
`yarn watch`

- __run linters__:
`yarn lint`

- __push dist/demo sub folder to github pages branch__:
`yarn deploy:demo`

### Build TODO - update
#### Running locally
1. Build by running
  `yarn build` or`yarn watch`
2. Open `takahuri/dist/demo/index.html` in a browser

#### Demo build
1. Build
  `yarn build`
2. Commit changes
  `git commit -am"V X.Y.Z"`
3. Push to gh-pages branch
  `yarn deploy-demo`
4. Update version number in `package.json` and push to master

#### Production build
1. Build `yarn build`
2. Update version number in `package.json`
3. Commit changes
  `git commit -am"V X.Y.Z"` 
4. Deploy to npm
   `npm publish`

### Code Style
There are linters set up to enforce code style, run with `yarn lint`.

### Tests
JavaScript unit tests are implemented with Jest
The specs are located in `/test` and can be run with `yarn test`
Test coverage can be reported by running `yarn test:coverage`

### Enhancement Backlog
