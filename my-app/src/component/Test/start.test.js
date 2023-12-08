import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import Start from '../start';
import userEvent from '@testing-library/user-event';
import withLoader from '../loader';
test('renders the title', () => {
  const { getByText } = render(
  <MemoryRouter>
    <Start />
  </MemoryRouter>);
  const titleElement = getByText('PRODUCTS:');
  expect(titleElement).toBeInTheDocument();
});

test('renders the search container and checks search functionality', () => {
  const { getByTestId, getByPlaceholderText } = render(
    <MemoryRouter>
      <Start />
    </MemoryRouter>
  );
  const searchContainerElement = getByTestId('search-container');
  expect(searchContainerElement).toBeInTheDocument();

  const searchInput = getByPlaceholderText('Search Products');
  userEvent.type(searchInput, 'tib'); 
});

test('renders the autosuggest input', () => {
  const { getByPlaceholderText } = render(
  <MemoryRouter>
    <Start />
  </MemoryRouter>);
  const autosuggestInput = getByPlaceholderText('Search Products');
  expect(autosuggestInput).toBeInTheDocument();
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

test('renders the pagination', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Start />
    </MemoryRouter>
  );
  const paginationElement = getByTestId('pagination');
  expect(paginationElement).toBeInTheDocument();
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
