import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Menext from '../menext'; 

test('renders the custom cards', () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <Menext />
      </MemoryRouter>
    );
  
    const customCards = getAllByTestId('custom-card');
    // Check if there are more than 0 custom cards rendered
    expect(customCards.length).toBeGreaterThan(0);
  });