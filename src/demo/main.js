import 'babel-polyfill';
import takahuri from '../takahuri';

const initialiseJSUtilities = () => {
  const body = document.getElementsByTagName('body')[0];

  body.classList.remove('no-js');
  body.classList.add('js');

  takahuri();
};

initialiseJSUtilities();
