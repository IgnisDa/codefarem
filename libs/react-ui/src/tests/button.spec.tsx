import { render } from '@testing-library/react';
import { Button } from '../lib/button';

describe('ReactUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Button />);
    expect(baseElement).toBeTruthy();
  });
});
