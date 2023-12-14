import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../homepage';

test('renders the custom cards for buyers', () => {
  if (localStorage.getItem('type') === 'buyer') {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const customCards = getAllByTestId('Card');
    expect(customCards.length).toBeGreaterThan(0);
  } 
});

test('renders the title', () => {
  if (localStorage.getItem('type') === 'buyer') {
  const { getByText } = render(
  <MemoryRouter>
    <Start />
  </MemoryRouter>);
  const titleElement = getByText('Title');
  expect(titleElement).toBeInTheDocument();
  }
});
  
test('renders the Reminder for buyers', () => {
  if (localStorage.getItem('type') === 'buyer') {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const customCards = getAllByTestId('Reminder');
    expect(customCards.length).toBeGreaterThan(0);
  } 
});

test('should filter items based on search query', async () => {
  if (localStorage.getItem('type') === 'seller') {
   render(<MemoryRouter>
    <HomePage />
  </MemoryRouter>);

  const searchInput = screen.getByPlaceholderText('Search...');
  fireEvent.change(searchInput, { target: { value: 't' } });

  await waitFor(() => {

    const table = screen.getByClassName('purchase-history-table');
    const tableRows = table.querySelectorAll('tbody > tr');
    expect(tableRows.length).toBeGreaterThan(0);
  });
}
});

test('renders BarGraph, PieChart, and BubbleGraph components', () => {
  if((localStorage.getItem('type') === 'seller' || localStorage.getItem('type') === 'company')){
  const { getByText } = render(<HomePage />);
  const barGraphElement = getByText(/BarGraph/i);
  const pieChartElement = getByText(/PieChart/i);
  const bubbleGraphElement = getByText(/BubbleGraph/i);
  expect(barGraphElement).toBeInTheDocument();
  expect(pieChartElement).toBeInTheDocument();
  expect(bubbleGraphElement).toBeInTheDocument();
  }
});

