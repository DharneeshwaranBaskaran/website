import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Address from '../address';

test('renders the title', () => {
    const { getByTestId } = render( 
      <MemoryRouter>
        <Address />
      </MemoryRouter>);
    const titleElement = getByTestId('PRODUCTS:'); 
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the Address form', () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
          <Address />
      </MemoryRouter>
    );
    const usernameInput = getByPlaceholderText('Personal Address');
     expect(usernameInput).toBeInTheDocument();
  });