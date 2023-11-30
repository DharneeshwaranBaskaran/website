import React from 'react';
import { render } from '@testing-library/react';
import Start from '../component/start';

test('renders the title', () => {
  const { getByText } = render(<Start />);
  const titleElement = getByText('PRODUCTS:');
  expect(titleElement).toBeInTheDocument();
});

test('renders the search container', () => {
  const { getByTestId } = render(<Start />);
  const searchContainerElement = getByTestId('search-container');
  expect(searchContainerElement).toBeInTheDocument();
});

test('renders the autosuggest input', () => {
  const { getByPlaceholderText } = render(<Start />);
  const autosuggestInput = getByPlaceholderText('Search Products');
  expect(autosuggestInput).toBeInTheDocument();
});

test('renders the custom cards', () => {
  const { getAllByTestId } = render(<Start />);
  const customCards = getAllByTestId('custom-card');
  expect(customCards.length).toBeGreaterThan(0);
});

test('renders the pagination', () => {
  const { getByTestId } = render(<Start />);
  const paginationElement = getByTestId('pagination');
  expect(paginationElement).toBeInTheDocument();
});

test('renders the video container', () => {
  const { getByTestId } = render(<Start />);
  const videoContainerElement = getByTestId('video-container');
  expect(videoContainerElement).toBeInTheDocument();
});
