import { render } from '@testing-library/react';

import { Button } from '.';

describe('ReactUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Button />);
    expect(baseElement).toBeTruthy();
  });
});
