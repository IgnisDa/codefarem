import { render } from '@testing-library/react';

import { Input } from '.';

describe('ReactUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Input />);
    expect(baseElement).toBeTruthy();
  });
});
