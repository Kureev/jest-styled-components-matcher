expect.extend({
  toHaveStyle(received, argument) {
    return {
      message: () => (
        `expected ${received} to be a styled component with partial style of ${JSON.stringify(argument)}`
      )
    };
  }
});
