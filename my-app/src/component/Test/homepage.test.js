import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../homepage';

  test('renders the custom cards', () => {
    const { container, getAllByTestId } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const customCards = getAllByTestId('Card');
    expect(customCards.length).toBeGreaterThan(0);
  });

  
  
// Mock data for the BarGraph
const mockData = [
  { topic: 'Topic1', count: 10, cost: 5 },
  { topic: 'Topic2', count: 15, cost: 7 },
  // Add more data as needed
];

test('renders graphs in HomePage', () => {
  // Render the component with mock data
  render(
    <MemoryRouter>
      <HomePage sortedData={mockData} />
    </MemoryRouter>
  );
  const getGraphByTestId = (testid) => {
    return screen.queryByTestId(testid);
  };
  const barGraph = getGraphByTestId('BarGraph');
  expect(barGraph).toBeInTheDocument();
  const pieChart = getGraphByTestId('PieChart');
  expect(pieChart).toBeInTheDocument();
  const bubbleGraph = getGraphByTestId('BubbleGraph');
  expect(bubbleGraph).toBeInTheDocument();
});