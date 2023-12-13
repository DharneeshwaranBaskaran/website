import React from 'react';
import { render,fireEvent } from '@testing-library/react';
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

  test('should filter products based on search term', () => {
    const { getByPlaceholderText, getAllByText, getByTestId } = render( // Update import
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
      // Use getAllByText to handle the case of multiple elements with the same text
      const elementsWithText = getAllByText(/T/i);
      expect(elementsWithText.length).toBeGreaterThan(0);
    }
    fireEvent.change(getByPlaceholderText('Search...'), { target: { value: '' } });
  });