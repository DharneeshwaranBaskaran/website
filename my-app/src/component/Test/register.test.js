import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import Register from '../register';

test('renders the title', () => {
    const { getByTestId } = render(
      <MemoryRouter>
          <Register /> 
      </MemoryRouter>
    );
    const titleElement = getByTestId('Title');
    expect(titleElement).toBeInTheDocument();
  });


  test('renders the registration form', () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
          <Register />
      </MemoryRouter>
    );
  
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');
    const emailInput = getByPlaceholderText('Email');
  
  
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });