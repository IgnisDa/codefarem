import { render } from '@testing-library/react';

import { ToggleGroup } from '.';

describe('ReactUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ToggleGroup items={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
