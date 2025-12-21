import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders conspiracy forum access terminal', () => {
  render(<App />);
  const accessElement = screen.getByText(/ACCESS TERMINAL/i);
  expect(accessElement).toBeInTheDocument();
});
