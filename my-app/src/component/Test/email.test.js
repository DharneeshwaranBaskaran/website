import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Email from '../Email';

test('renders the title Buyer', () => { 
      const { getByTestId } = render( 
        <MemoryRouter>
          <Email />
        </MemoryRouter>);
      const titleElement = getByTestId('PRODUCTS:'); 
      expect(titleElement).toBeInTheDocument(); 
    });
  
    test('renders the Email form', () => {
        const { getByPlaceholderText, getByText } = render(
          <MemoryRouter>
              <Email />
          </MemoryRouter>
        );
        const email = getByPlaceholderText('Enter Email');
         expect(email).toBeInTheDocument();
      });
    