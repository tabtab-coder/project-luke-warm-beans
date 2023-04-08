import React from 'react';
import { render } from '@testing-library/react';
import Login from './Login';

test('renders login page', () => {
  const { getByText } = render(<Login/>);
  const loginElements = getByText(/Login/);
  expect(loginElements).toBeInTheDocument();
});