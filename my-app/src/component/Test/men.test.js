import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Men from '../men'; 
import userEvent from '@testing-library/user-event';

test('renders the custom cards', () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
      <Men />
    </MemoryRouter>
    );
    const customCards = getAllByTestId('custom-card');
    expect(customCards.length).toBeGreaterThan(0);
  });

  test('renders the search container and checks search functionality', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <MemoryRouter>
        <Men />
      </MemoryRouter>
    );
    const searchContainerElement = getByTestId('search-container');
    expect(searchContainerElement).toBeInTheDocument();
  
    const searchInput = getByPlaceholderText('Search...');
    userEvent.type(searchInput, 'tib'); 
  });