import { render } from '@testing-library/react';
import { Input } from '../lib/input';

describe('ReactUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Input />);
    expect(baseElement).toBeTruthy();
  });
});
