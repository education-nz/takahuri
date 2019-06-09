// Some helper methods to inspect the jsdom

export const elementWithID = id => document.getElementById(id);

export const allWithClass = targetClass => Array.from(document.querySelectorAll(`.${targetClass}`));

export const firstWithClass = targetClass => allWithClass(targetClass)
  .pop() || null;

export const hasClass = (targetClass, element) => {
  const result = allWithClass(targetClass);
  return result.length > 0 && result.includes(element);
};

const mouseEvent = (element, type = 'click') => {
  const event = document.createEvent('MouseEvent');
  event.initEvent(type, true, true);
  element.dispatchEvent(event);
};

export const mouseUp = element => mouseEvent(element, 'mouseup');

export const click = element => mouseEvent(element);

export const keyPress = (key, element) => {
  const event = new KeyboardEvent('keyup', {
    bubbles: true,
    keyCode: key,
  });
  element.dispatchEvent(event);
};

export const giveItASec = (callback, delay = 50) => setTimeout(callback, delay);

export const triggerDOMContentLoaded = () => {
  document.dispatchEvent(new Event('DOMContentLoaded', {
    bubbles: true,
    cancelable: true,
  }));
};
