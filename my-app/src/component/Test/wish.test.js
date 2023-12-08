import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Phone from '../Wish';

test('renders the title Buyer', () => { 
    const { getByTestId } = render( 
      <MemoryRouter>
        <Phone />
      </MemoryRouter>);
    const titleElement = getByTestId('PRODUCTS'); 
    expect(titleElement).toBeInTheDocument(); 
  });
  
  test('renders table element', () => {
    const { getByRole } = render(<MemoryRouter><Phone /></MemoryRouter>);
    expect(getByRole('table')).toBeInTheDocument();
  });
  