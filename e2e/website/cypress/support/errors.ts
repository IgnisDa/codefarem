Cypress.on('uncaught:exception', (err, _runnable) => {
  // Cypress and React Hydrating the document don't get along
  // for some unknown reason. Hopefully, we figure out why eventually
  // so we can remove this.
  if (
    /hydrat/i.test(err.message) ||
    err.message.includes('Minified React error #418') ||
    err.message.includes('Minified React error #423')
  )
    return false;
  return true;
});

export {};
