/* global describe, expect, it, jest, beforeEach, beforeAll, window, document, localStorage */
/* eslint-disable react/no-unknown-property */

import {
  mouseUp,
  keyPress,
  firstWithClass,
  triggerDOMContentLoaded, elementWithID,
} from './test-utils';
import initLanguageToggle, { KEYS, DEFAULT_CONFIG } from '../src/takahuri';

const getToggle = () => firstWithClass('lang-toggle');

const testDOMToggle = '<button class="lang-toggle"></button>';
const testDOMAttributes = '<div id="test1" lang="en-nz" data-toggles="lang" data-lang-en="en-nz" data-lang-mi="mi"></div>';
const testDOMDataAttributes = '<div id="test2" data-lang-active="lang--en" data-toggles="data-lang-active" data-lang-active-en="lang--en"  data-lang-active-mi="lang--mi"></div>';

describe('toggle', () => {
  beforeAll(() => {
    document.documentElement.innerHTML = `<head></head><body>${testDOMToggle}${testDOMAttributes}${testDOMDataAttributes}</body>`;
  });

  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.getItem.mockImplementation(() => 'en');
    // eslint-disable-next-line no-global-assign
    window.toggleLanguage = null;
    window.setLanguage = null;
    window.getLanguage = null;
  });

  it('initialises the toggle', () => {
    initLanguageToggle();
    triggerDOMContentLoaded();
    const toggle = getToggle();

    expect(toggle)
      .toBeDefined();
    expect(toggle.getAttribute('tabindex'))
      .toEqual('0');
    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(1);
    expect(localStorage.getItem)
      .toHaveBeenCalledWith(DEFAULT_CONFIG.storageKey);
    expect(localStorage.setItem)
      .toHaveBeenCalledTimes(1);
    expect(localStorage.setItem)
      .toHaveBeenLastCalledWith(DEFAULT_CONFIG.storageKey, 'en');
  });

  it('toggles state on click', () => {
    const toggle = getToggle();
    mouseUp(toggle);

    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(1);
    expect(localStorage.setItem)
      .toHaveBeenCalledTimes(1);
    expect(localStorage.setItem)
      .toHaveBeenLastCalledWith(DEFAULT_CONFIG.storageKey, 'mi');
  });

  it('toggles state on key press', () => {
    const toggle = getToggle();
    localStorage.getItem.mockImplementation(() => 'mi');

    keyPress(KEYS.enter, toggle);

    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(1);
    expect(localStorage.setItem)
      .toHaveBeenCalledTimes(1);
    expect(localStorage.setItem)
      .toHaveBeenCalledWith(DEFAULT_CONFIG.storageKey, 'en');

    localStorage.getItem.mockImplementation(() => 'en');
    keyPress(KEYS.space, toggle);

    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(2);
    expect(localStorage.setItem)
      .toHaveBeenCalledTimes(2);
    expect(localStorage.setItem)
      .toHaveBeenCalledWith(DEFAULT_CONFIG.storageKey, 'mi');

    keyPress(KEYS.escape, toggle); // do nothing

    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(2);
    expect(localStorage.setItem)
      .toHaveBeenCalledTimes(2);
  });

  it('toggles attributes', () => {
    const toggle = getToggle();
    const target = elementWithID('test1');

    localStorage.getItem.mockImplementation(() => 'mi');
    mouseUp(toggle);

    expect(target)
      .toBeDefined();
    expect(target.getAttribute('lang'))
      .toEqual(target.getAttribute('data-lang-en'));

    localStorage.getItem.mockImplementation(() => 'en');
    mouseUp(toggle);

    expect(target.getAttribute('lang'))
      .toEqual(target.getAttribute('data-lang-mi'));
  });

  it('toggles data attributes', () => {
    const toggle = getToggle();
    const target = elementWithID('test2');

    localStorage.getItem.mockImplementation(() => 'mi');
    mouseUp(toggle);

    expect(target)
      .toBeDefined();
    expect(target.getAttribute('data-lang-active'))
      .toEqual(target.getAttribute('data-lang-active-en'));

    localStorage.getItem.mockImplementation(() => 'en');
    mouseUp(toggle);

    expect(target.getAttribute('data-lang-active'))
      .toEqual(target.getAttribute('data-lang-active-mi'));
  });

  it('initialises the toggle in lang b if urlFlag is present', () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: {
          includes: jest.fn(() => true),
        },
      },
      writable: true,
    });
    initLanguageToggle();

    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(0);
    expect(localStorage.setItem)
      .toHaveBeenCalledTimes(1);
    expect(localStorage.setItem)
      .toHaveBeenLastCalledWith(DEFAULT_CONFIG.storageKey, 'mi');
  });

  it('Allows programmatic get language', () => {
    initLanguageToggle();
    jest.clearAllMocks();

    expect(window.getLanguage)
      .not
      .toBeNull();
    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(0);

    const result = window.getLanguage();

    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(1);
    expect(result)
      .toBe('en');
  });

  it('Allows programmatic toggling', () => {
    initLanguageToggle();
    jest.clearAllMocks();

    expect(window.toggleLanguage)
      .not
      .toBeNull();
    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(0);

    window.toggleLanguage();

    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(1);
    expect(localStorage.setItem)
      .toHaveBeenCalledTimes(1);
    expect(localStorage.setItem)
      .toHaveBeenLastCalledWith(DEFAULT_CONFIG.storageKey, 'mi');
  });

  it('Allows language to be explicitly set programmatically', () => {
    initLanguageToggle();
    jest.clearAllMocks();

    expect(window.setLanguage)
      .not
      .toBeNull();
    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(0);
    expect(localStorage.setItem)
      .toHaveBeenCalledTimes(0);

    window.setLanguage('en');

    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(0);
    expect(localStorage.setItem)
      .toHaveBeenCalledTimes(1);
    expect(localStorage.setItem)
      .toHaveBeenLastCalledWith(DEFAULT_CONFIG.storageKey, 'en');

    window.setLanguage('mi');

    expect(localStorage.getItem)
      .toHaveBeenCalledTimes(0);
    expect(localStorage.setItem)
      .toHaveBeenCalledTimes(2);
    expect(localStorage.setItem)
      .toHaveBeenLastCalledWith(DEFAULT_CONFIG.storageKey, 'mi');
  });

  it('Does not define programmatic interfaces if disabled by config', () => {
    initLanguageToggle({ globalFunctions: false });
    expect(window.toggleLanguage)
      .toBeNull();
    expect(window.getLanguage)
      .toBeNull();
    expect(window.setLanguage)
      .toBeNull();
  });

  it('Emits event on toggle', () => {
    const toggle = getToggle();
    const listenerSpy = jest.fn();
    document.addEventListener('ToggledLanguage', listenerSpy);
    mouseUp(toggle);

    expect(localStorage.setItem)
      .toHaveBeenLastCalledWith(DEFAULT_CONFIG.storageKey, 'mi');
    expect(listenerSpy)
      .toHaveBeenCalledTimes(1);

    document.removeEventListener('ToggledLanguage', listenerSpy);
  });

  it('Does not emits event on toggle if disabled by config', () => {
    initLanguageToggle({ emitEvent: false });
    const listenerSpy = jest.fn();
    document.addEventListener('ToggledLanguage', listenerSpy);

    window.toggleLanguage();

    expect(localStorage.setItem)
      .toHaveBeenLastCalledWith(DEFAULT_CONFIG.storageKey, 'mi');
    expect(listenerSpy)
      .toHaveBeenCalledTimes(0);
    document.removeEventListener('ToggledLanguage', listenerSpy);
  });
});
