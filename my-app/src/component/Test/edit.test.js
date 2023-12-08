import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Edit from '../edit';

test('renders the title Buyer', () => { 
      const { getByTestId } = render( 
        <MemoryRouter>
          <Edit />
        </MemoryRouter>);
      const titleElement = getByTestId('PRODUCTS:'); 
      expect(titleElement).toBeInTheDocument(); 
    });
  
    test('renders the Email form', () => {
        const { getByPlaceholderText, getByText } = render(
          <MemoryRouter>
              <Edit />
          </MemoryRouter>
        );
        const cost = getByPlaceholderText('cost');
         expect(cost).toBeInTheDocument();
      });
    