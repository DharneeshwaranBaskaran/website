import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import LoginPage from '../loginpage'; 

test('renders the login form', () => {
    const { getByPlaceholderText, } = render(
      <MemoryRouter>
          <LoginPage />
      </MemoryRouter>
    );
  
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test('renders the title', () => {
    const { getByTestId } = render(
      <MemoryRouter>
          <LoginPage /> 
      </MemoryRouter>
    );
    const titleElement = getByTestId('Title');
    expect(titleElement).toBeInTheDocument();
  });
