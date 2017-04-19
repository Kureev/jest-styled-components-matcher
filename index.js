const {
  EXPECTED_COLOR,
  RECEIVED_COLOR,
  ensureNoExpected,
  ensureNumbers,
  getType,
  matcherHint,
  printReceived,
  printExpected,
  printWithType,
} = require('jest-matcher-utils');
const parse = require('styled-components/lib/vendor/postcss-safe-parser/parse');

expect.extend({
  toHaveStyleRule(received, name, value) {
    const { rules } = received.type();
    const props = received.props();
    const ast = parse(rules.join());

    /**
     * Fail by default
     */
    let pass = false;

    /**
     * There can be two cases:
     * - rule (dynamic property, value is a function of props)
     * - decl (static property, value is a string)
     *
     * We also take the last matched node because
     * developer may override initial assignment
     */
    const node = ast.nodes.filter((node) => {
      switch (node.type) {
        case 'rule':
          return node.selector.indexOf(name) === 0;
        case 'decl':
          return node.prop === name;
        default: break;
      }
    }).pop();

    let result = node.value;

    /**
     * In a case of declaration, it's fairly easy to check if expected === given
     */
    if (node.type === 'decl') {
      pass = node.value === value;
    /**
     * But in case of rule we have quite some complexity here:
     * We can't get a ref to the function using `postcss-safe-parser`, so
     * we have to construct it by ourselves. We also don't know how user called `props`
     * in his value function, so we parse the entire CSS block to match its params and body
     *
     * Once params are matched, we construct a new function and
     * invoke it with props, taken from the enzyme
     */
    } else {
      const match = node.source.input.css.match(new RegExp(`${name}:.*,function \(.*\)\{(.*)\},;`));
      const param = match[1].slice(1, -1);
      const fn = Function(param, match[2]);
      result = fn(props);
      pass = result === value;
    }

    const message = pass
      ? () =>
        matcherHint('.not.toHaveStyleRule') + '\n\n' +
        `Expected ${received.type().displayName} to have style rule:\n` +
        `  ${printExpected(`${name}: ${value}`)}\n` +
        `Received:\n` +
        `  ${printReceived(name + ': ' + result)}`
    : () => {
        return (
          matcherHint('.toHaveStyleRule') + '\n\n' +
          `Expected ${received.type().displayName} to have style rule:\n` +
          `  ${printExpected(`${name}: ${value}`)}\n` +
          `Received:\n` +
          `  ${printReceived(name + ': ' + result)}`
        );
      };

    /**
     * Construct a message to return
     */
    return { message, pass };
  },
});
