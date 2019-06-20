/**
 * Config
 */
export const KEYS = {
  enter: 13,
  escape: 27,
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
  globalFunctions: true,
  emitEvent: true,
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

const emitToggleEvent = (newLanguage, _document = document) => {
  _document.dispatchEvent(new Event('ToggledLanguage', {
    newLanguage,
  }));
};

const getLanguageValue = (config, lang, element, attribute) => {
  const { langOptionsPrefix } = config.identifiers;
  const prefix = attribute.startsWith(langOptionsPrefix) ? '' : langOptionsPrefix;
  const key = (lang === config.langKey.a ? `${prefix}${attribute}-${config.langKey.a}` : `${prefix}${attribute}-${config.langKey.b}`);
  return element.getAttribute(key);
};

const commaSeparatedAttributeArray = attributes => attributes.split(',');

const updateAttribute = (config, lang) => (element) => {
  const attributes = commaSeparatedAttributeArray(element.getAttribute(config.identifiers.flag));
  attributes.forEach((attribute) => {
    const updatedValue = getLanguageValue(config, lang, element, attribute);
    element.setAttribute(attribute, updatedValue);
  });
};

const updateAttributes = (config, lang) => {
  const elements = getElementsWithQuery(`[${config.identifiers.flag}]`);
  elements.forEach(updateAttribute(config, lang));
};

const saveToLocalStorage = (config, value) => {
  localStorage.setItem(config.storageKey, value);
};

const getFromLocalStorage = config => localStorage.getItem(config.storageKey);

const getCurrentLanguage = config => () => getFromLocalStorage(config) || config.defaultLang;

const getToggledValue = (config) => {
  const currentValue = getCurrentLanguage(config)();
  return currentValue === config.langKey.a ? config.langKey.b : config.langKey.a;
};

const toggleLanguageInLocalStorage = (config) => {
  const toggledValue = getToggledValue(config);
  saveToLocalStorage(config, toggledValue);
  return toggledValue;
};

const updateLanguage = (config, newLanguage) => {
  updateAttributes(config, newLanguage);
  if (config.emitEvent === true) {
    emitToggleEvent(newLanguage);
  }
};

const setLanguage = config => (newLanguage) => {
  updateLanguage(config, newLanguage);
  saveToLocalStorage(config, newLanguage);
};

const toggleLanguage = config => (event = null) => {
  if (event) {
    event.stopPropagation();
  }
  const lang = toggleLanguageInLocalStorage(config);
  updateLanguage(config, lang);
};

const attachLanguageToggle = (config, toggleFunction) => () => {
  const button = getElementsWithQuery(config.identifiers.toggle)
    .pop();
  attachListeners(config, button, toggleFunction);
  attachKeyListeners(config, button, toggleFunction);
  setTabIndex(button);
};

const getUrlParam = (config, _window = window) => {
  // If the flag is present return lang b
  return _window.location.search.includes(config.urlFlag) ? config.langKey.b : null;
};

const loadInitialState = (config) => {
  const urlValue = getUrlParam(config);
  const initialValue = urlValue || getFromLocalStorage(config) || config.defaultLang;
  if (initialValue === config.defaultLang || initialValue === null) {
    updateAttributes(config, config.langKey.a);
    saveToLocalStorage(config, config.langKey.a);
    return;
  }

  updateAttributes(config, config.langKey.b);
  saveToLocalStorage(config, config.langKey.b);
};

const registerGlobalToggleFunctions = (
  toggleFunction,
  setLanguageFunction,
  getCurrentLanguageFunction,
  _window = window,
) => {
  _window.toggleLanguage = toggleFunction; // eslint-disable-line no-param-reassign
  _window.setLanguage = setLanguageFunction; // eslint-disable-line no-param-reassign
  _window.getLanguage = getCurrentLanguageFunction; // eslint-disable-line no-param-reassign
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
  const toggleFunction = toggleLanguage(config);

  loadInitialState(config);
  if (config.globalFunctions === true) {
    registerGlobalToggleFunctions(toggleFunction, setLanguage(config), getCurrentLanguage(config));
  }

  const handler = attachLanguageToggle(config, toggleFunction);
  document.addEventListener('DOMContentLoaded', handler);

  return handler;
};

export default initLanguageToggle;
