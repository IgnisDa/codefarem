import { render } from '@testing-library/react';

import { Loading } from '.';

describe('ReactUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Loading />);
    expect(baseElement).toBeTruthy();
  });
});
