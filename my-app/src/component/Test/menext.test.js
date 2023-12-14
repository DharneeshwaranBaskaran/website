import React from 'react';
import { render ,fireEvent,waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import Menext from '../menext'; 

test('renders the custom cards', () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <Menext />
      </MemoryRouter>
    );
    const customCards = getAllByTestId('custom-card');
    expect(customCards.length).toBeGreaterThan(0);
  });
  
  