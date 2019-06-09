/**
 * Config
 */
export const KEYS = {
  enter: 13,
  space: 32,
};

export const DEFAULT_CONFIG = {
  events: {
    click: ['mouseup'],
    key: ['keyup'],
  },
  targetKeys: [KEYS.enter, KEYS.space],
  identifiers: {
    toggle: '.lang-toggle',
    flag: 'data-toggles',
    langOptionsPrefix: 'data-',
  },
  langKey: {
    a: 'en',
    b: 'mi',
  },
  defaultLang: 'en',
  urlFlag: 'l=mi',
  storageKey: 'takahuri-state',
};

/**
 * Private functions
 */
export const getElementsWithQuery = query => Array.from(document.querySelectorAll(query));

export const getElementsWithAttribute = attribute => Array.from(document.querySelectorAll(`[${attribute}]`));

export const attachListeners = (config, element, action, events = null) => {
  const e = events || config.events.click;
  e.forEach((event) => {
    element.addEventListener(event, action);
  });
};

export const keyPressIsOneOf = (targetKeys, event) => {
  const code = event.keyCode || event.which;
  return targetKeys.includes(code);
};

export const getKeypressHandler = (config, action) => (event) => {
  if (keyPressIsOneOf(config.targetKeys, event)) {
    action(event);
  }
};

export const attachKeyListeners = (config, element, action) => {
  attachListeners(config, element, getKeypressHandler(config, action), config.events.key);
};

const setTabIndex = target => target.setAttribute('tabindex', 0);

const getLanguageValue = (config, lang, element, attribute) => {
  const { langOptionsPrefix } = config.identifiers;
  const prefix = attribute.startsWith(langOptionsPrefix) ? '' : langOptionsPrefix;
  const key = lang === config.langKey.a ? `${prefix}${attribute}-${config.langKey.a}` : `${prefix}${attribute}-${config.langKey.b}`;
  return element.getAttribute(key);
};

const updateAttribute = (config, lang) => (element) => {
  const attribute = element.getAttribute(config.identifiers.flag);
  const updatedValue = getLanguageValue(config, lang, element, attribute);
  element.setAttribute(attribute, updatedValue);
};

const updateAttributes = (config, lang) => {
  const elements = getElementsWithQuery(`[${config.identifiers.flag}]`);
  elements.forEach(updateAttribute(config, lang));
};

const saveToLocalStorage = (config, value) => {
  localStorage.setItem(config.storageKey, value);
};

const getFromLocalStorage = config => localStorage.getItem(config.storageKey);

const getToggledValue = (config) => {
  const currentValue = getFromLocalStorage(config) || config.defaultLang;
  return currentValue === config.langKey.a ? config.langKey.b : config.langKey.a;
};

const toggleLanguageInLocalStorage = (config) => {
  const toggledValue = getToggledValue(config);
  saveToLocalStorage(config, toggledValue);
  return toggledValue;
};

const toggleLanguage = config => (event) => {
  event.stopPropagation();
  const lang = toggleLanguageInLocalStorage(config);
  updateAttributes(config, lang);
};

const attachLanguageToggle = config => () => {
  const button = getElementsWithQuery(config.identifiers.toggle)
    .pop();
  attachListeners(config, button, toggleLanguage(config));
  attachKeyListeners(config, button, toggleLanguage(config));
  setTabIndex(button);
};

const getUrlParam = (config, _window = window) => {
  // If the flag is present return lang b
  return _window.location.search.includes(config.urlFlag) ? config.langKey.b : null;
};

const loadInitialState = (config) => {
  const urlValue = getUrlParam(config);
  console.log(urlValue);
  const initialValue = urlValue || getFromLocalStorage(config) || config.defaultLang;
  if (initialValue === config.defaultLang || initialValue === null) {
    updateAttributes(config, config.langKey.a);
    saveToLocalStorage(config, config.langKey.a);
    return;
  }

  updateAttributes(config, config.langKey.b);
  saveToLocalStorage(config, config.langKey.b);
};

// Override and keys on the default config that are supplied in customConfig
const mergeConfigs = customConfig => ({
  ...DEFAULT_CONFIG,
  ...customConfig,
});

/**
 * Public interface
 */

const initLanguageToggle = (customConfig) => {
  // attach toggle on load
  const config = mergeConfigs(customConfig);
  loadInitialState(config);
  document.addEventListener('DOMContentLoaded', attachLanguageToggle(config));
};

export default initLanguageToggle;
