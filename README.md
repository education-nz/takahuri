# Takahuri
**Takahuri - a verb in Te Reo Maori meaning to convert, change, switch.**

A utility for creating bilingual content toggling with JavaScript.
Implemented in vanillaJS in a functional style.

See demo: https://education-nz.github.io/takahuri/

## Installation & Usage
### Installation
Takahuri can be installed from NPM `yarn add takahuri`

### Usage
Import into your main javascript package
 
```
import takahuri from 'takahuri';
   
takahuri();
``` 

The lib does not come transpiled or with polyfills.
To support older browsers e.g. IE11 you'll need to use babel and polyfills.
See the demo for further detail `src/demo/main.js` (transpiled with babel via laravel mix).

**NOTE:**
To disable chromes auto translation feature add the following meta to `<head>`:  
`<meta name="google" value="notranslate">`


## How does it work?
- Mounting  
Takahuri, binds the toggle events on `DOMContentLoaded`, The toggle must be rendered on screen at this time.
Elements with toggleable attributes can be added dynamically.

- Define a toggle  
Finds the toggle element specified by the class `lang-toggle`(unless overridden in config `identifiers.toggle`).
Binds keyboard and mouse events. You may add as many toggles as required, however you must use a consistent toggle identifier, as toggles are selected by class name.

- Toggle attribute value  
Each time the toggle is triggered a script runs to find all toggling attributes on the page and toggles their current values.

toggling attributes can be defined as follows:
```
<html
    data-toggles="lang"     // data-toggles: flag to identify which attribute will toggle
    lang="en-nz"            // inital value for the target attribute
    data-lang-en="en-nz"    // data-<attr>-<lang.a>: value for lang a
    data-lang-mi="mi"       // data-<attr>-<lang.b>: value for lang b
>
```

Multiple attributes can be targeted on the same element.
Comma separate the attribute names in `data-toggles` and provide all the required lang options, 
as per the following example.

```
<html
    data-toggles="lang,data-active"
    lang="en-nz"             
    data-lang-en="en-nz"    
    data-lang-mi="mi"       
    data-active="lang--mi"
    data-active-en="lang--en"
    data-active-mi="lang--mi"
>
```

## How to use Takahuri to support accessible bilingual toggling on a web page

- Define a toggle
    ```
    <div class="lang-toggle"
         role="switch"
         data-toggles="aria-checked"
         aria-label="View this site in Te Reo Maori"
         aria-checked="false"
         data-aria-checked-en="false"
         data-aria-checked-mi="true"
    >
            <span class="lang--ma">View in En</span>
            <span class="lang--en">View in Mā</span>
    </div>
    
    ```
  
- Set the page 'lang'
    ```
    <html
        data-toggles="lang"
        lang="en-nz"
        data-lang-en="en-nz"
        data-lang-mi="mi"
    >  
    ```

- Setup css visibility classes
    ```
    <body class="demo"
          data-toggles="data-lang-active"
          data-lang-active="lang--mi"
          data-lang-active-en="lang--en"
          data-lang-active-mi="lang--mi"
    >
    ```
    SCSS:
    ```
    .lang {
      &--en {
        [data-lang-active="lang--mi"] & {
          display: none;
        }
      }
    
      &--mi {
        [data-lang-active="lang--en"] & {
          display: none;
        }
      }
    }
    ```
    OR CSS:
    ```
    [data-lang-active="lang--mi"] .lang--en {
          display: none;
    }
    
    [data-lang-active="lang--en"] .lang--mi {
        display: none;
    }
    ```
    Then wrap all text in the relevant language class visibility will be toggled by css on toggle.

- Toggle content in attributes (e.g. alt text)
    ```
    <img src="test.svg"
         data-toggles="alt"
         alt="A placeholder image"
         data-alt-en="A placeholder image"
         data-alt-mi="Te reo caption">
    ```

For further detail check out the demo `src/demo/index.html`

## Features
### Customisable
Out of the box Takahuri is designed to toggle between English and Te Reo Maori.
It's primary use case is to support bilingual content on ministry websites. 
However all the data tags used are customisable, 
meaning you could adapt the tool to support different languages, or for other binary mode toggling.      

#### Config options
Pass in a object overriding any of the config structure below.
``` {
  events: {
    click: Mouse event (DEFAULT: ['mouseup']),
    key: Keyboard event (DEFAULT: ['keyup']),
  },
  targetKeys: Keys that trigger toggle event (DEFAULT: [KEYS.enter, KEYS.space]),
  identifiers: {
    toggle: CSS identifier (DEFAULT: '.lang-toggle'),
    flag: Flag attribute name (DEFAULT: 'data-toggles'),
    langOptionsPrefix: Option attribute prefix (DEFAULT: 'data-'),
  },
  langKey: {
    a: First language key (DEFAULT: 'en'),
    b: Second language key (DEFAULT: 'mi'),
  },
  defaultLang: Default option of above languages (DEFAULT: 'en'),
  urlFlag: URL parameter flag (DEFAULT: 'l=mi'),
  storageKey: Local storage key (DEFAULT: 'takahuri-state'),
  globalFunctions: Register 'toggleLanguage' and 'setLanguage(<key>)' as a global function on window (DEFAULT: true),
  emitEvent: On toggle emit 'ToggledLanguage' event from document root (DEFAULT: true),
}
```

### Set initial language via url flag
If the url flag defined in config.urlFlag is passes is present as a url variable (`example.com?l=mi`) 
the initial language code will be set as langkey.b as defined in config
 
### A11y support
- Supports toggling by mouse and keyboard
- Adds tabindex to toggle to ensure it's focus-able
- Allows aria tags to be toggled too, so aria-label etc can be toggled between languages

**Note: Aria labels should still be manually defined on the toggle element, see examples in this read me.**

### Programmatic interfaces
- Global function
     the following global functions can be use control the toggling programmatically:
     - `window.toggleLanguage()`
     - `window.getCurrentLanguage()` get the current language from localStorage
     - `window.setLanguage(<KEY>)` where KEY is one of the values specified in config.langKey
     _Registration of these functions can be disabled by custom config_
- Custom Event
    When a toggle occurs the custom event `ToggledLanguage` will be emitted from the document root.
    _This functionality can be disabled by custom config_

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

### Build
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
