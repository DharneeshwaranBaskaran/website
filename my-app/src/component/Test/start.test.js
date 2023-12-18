import React from 'react';
import { screen, render, fireEvent,getByText,  waitFor, } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 

import Start from '../start';
import { createMemoryHistory } from 'history';
test('renders the title', () => {
  const { getByText } = render(
    <MemoryRouter>
      <Start />
    </MemoryRouter>);
  const titleElement = getByText('PRODUCTS:');
  expect(titleElement).toBeInTheDocument();
});

test('should filter products based on search term', () => {
  const { getByPlaceholderText, getByTestId } = render(
    <MemoryRouter>
      <Start />
    </MemoryRouter>
  );
  expect(getByPlaceholderText('Search Products')).toHaveValue('');
  fireEvent.change(getByPlaceholderText('Search Products'), { target: { value: 'qwerty' } });
  const customCardContainer = getByTestId('custom-card');
  if (customCardContainer) {
    expect(customCardContainer).toContainElement(getByTestId('no products'));
  } else {
    expect(getByTestId('custom-card')).toHaveLength(1);
    expect(getByTestId('custom-card')).toContainElement(getByText(/Tib/i));
  }
  fireEvent.change(getByPlaceholderText('Search Products'), { target: { value: '' } });
});

test('suggestion list appears when text is typed without any error', async () => {
  render(<MemoryRouter>
          <Start />
       </MemoryRouter>);

  const searchInput = screen.getByPlaceholderText('Search Products');
  fireEvent.change(searchInput, { target: { value: 'Formal' } });

  const suggestionsList = screen.getByTestId('search-container');
  expect(suggestionsList).toBeInTheDocument();
});


test('renders the custom cards', () => {
  const { getAllByTestId } = render(
    <MemoryRouter>
      <Start />
    </MemoryRouter>
  );
  const customCards = getAllByTestId('custom-card');
  expect(customCards.length).toBeGreaterThan(0);
});

test('should render with pagination and handle page clicks', async () => {
  render(
    <MemoryRouter>
      <Start />
    </MemoryRouter>
  );
  const cards = screen.getAllByTestId('custom-card');
  expect(cards.length).toBeLessThanOrEqual(15);
  await waitFor(() => {
    const paginationButton = screen.getByTestId('pagination-button');
    expect(paginationButton).toBeInTheDocument();
    fireEvent.click(paginationButton);
  });
});

test('renders the video container', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Start />
    </MemoryRouter>
  );
  const videoContainerElement = getByTestId('video-container');
  expect(videoContainerElement).toBeInTheDocument();
});
