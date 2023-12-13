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
    const { getByPlaceholderText } = render(
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

  test('renders the registration buyer', () => {  
    if(localStorage.getItem("type")=="buyer"){
    const { getByPlaceholderText } = render(
      <MemoryRouter>
          <Register />
      </MemoryRouter> 
    );
    const address = getByPlaceholderText('Personal Address');
    expect(address).toBeInTheDocument();
  }
  });

  test('renders the registration seller', () => {  
    if(localStorage.getItem("type")=="seller"){
    const { getByPlaceholderText } = render(
      <MemoryRouter>
          <Register />
      </MemoryRouter> 
    );
    const address = getByPlaceholderText('Personal Address'); 
    const name=getByPlaceholderText('Name');
    const Company=getByPlaceholderText('Company');
    const comadd=getByPlaceholderText('Company Address'); 
    const Contact=getByPlaceholderText('Contact Number');
    expect(address).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(Company).toBeInTheDocument();
    expect(comadd).toBeInTheDocument();
    expect(Contact).toBeInTheDocument();
  }
  });

  test('renders the registration seller', () => {  
    if(localStorage.getItem("type")=="company"){
    const { getByPlaceholderText } = render(
      <MemoryRouter>
          <Register />
      </MemoryRouter> 
    );
    const website=getByPlaceholderText('Website');
    const Company=getByPlaceholderText('Company');
    const comadd=getByPlaceholderText('Company Address'); 
    const Contact=getByPlaceholderText('Contact Number');
    expect(website).toBeInTheDocument();
    expect(Company).toBeInTheDocument();
    expect(comadd).toBeInTheDocument();
    expect(Contact).toBeInTheDocument();
  }
  });