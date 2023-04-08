import React from 'react';
import { render } from '@testing-library/react';
import About from './About';

test('renders about page', () => {
  const { getByText } = render(<About/>);
  const aboutElements = getByText("About U-Impactify");
  expect(aboutElements).toBeInTheDocument();
});
