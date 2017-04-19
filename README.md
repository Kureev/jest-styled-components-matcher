[React Native] Jest matchers for styled-components
==

## Motivation
Add a way to check if styled-component has a style rule (or style rule has a right value)

## Installation
```bash
yarn add jest-styled-components-matcher --dev
```
or
```bash
npm i jest-styled-components-matcher -D
```

## Usage
Just import it in the place you're going to use it:
```js
import 'jest-styled-components-matcher'
```
That's it! Now you can use it in your tests:
```js
describe('Avatar', () => {
  it('uses default size property (64) to calculate proper border radius (32)', () => {
    expect(shallow(<Avatar />)).toHaveStyleRule('border-radius', 32);
  });
});
```

## Assertation messages

- Wrong value
![](https://snag.gy/4Z07wJ.jpg)

- Missing rule
![](https://snag.gy/gbOw1J.jpg)
