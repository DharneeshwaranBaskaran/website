import React from 'react';
import { render,fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import Men from '../men'; 

test('renders the custom cards', () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
      <Men />
    </MemoryRouter>
    );
    const customCards = getAllByTestId('custom-card');
    expect(customCards.length).toBeGreaterThan(0);
  });

  test('should filter products based on search term', () => {
    const { getByPlaceholderText, getAllByText, getByTestId } = render( 
      <MemoryRouter>
        <Men />
      </MemoryRouter>
    );
    expect(getByPlaceholderText('Search...')).toHaveValue('');
    fireEvent.change(getByPlaceholderText('Search...'), { target: { value: 'Formal Shirt' } });
    const customCardContainer = getByTestId('custom-card');
    if (!customCardContainer) {
      expect(customCardContainer).toContainElement(getByTestId('no products'));
    } else {
      expect(customCardContainer).toBeInTheDocument();
      const elementsWithText = getAllByText(/T/i);
      expect(elementsWithText.length).toBeGreaterThan(0);
    }
    fireEvent.change(getByPlaceholderText('Search...'), { target: { value: '' } });
  });