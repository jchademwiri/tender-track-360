import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { JSDOM } from 'jsdom';

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;

