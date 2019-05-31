import React from 'react';
import {render, cleanup} from '@testing-library/react';
import SpotifyPlayBar from './index.js';
import '@babel/polyfill'
// More expect matchers are available with this, but I don't need them yet:
// import 'jest-dom/extend-expect';

afterEach(cleanup);

test('Component can be rendered', async () => {
  render(<SpotifyPlayBar/>);
});
