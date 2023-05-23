import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import axios from 'axios';
import LoginReg from './LoginReg';
import '@testing-library/jest-dom/extend-expect'; 

jest.mock('axios');

const localStorageMock = (function() {
  let store = {};
  
  return {
    getItem(key) {
      return store[key];
    },
 
    setItem(key, value) {
      store[key] = value;
    },
  
    clear() {
      store = {};
    },

    removeItem(key) {
      delete store[key];
    },
     
    getAll() {
      console.log(store);
    }
  };
})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('LoginReg', () => {

  test('Render check for Registration and Login box', async () => {
    const handleChildData = jest.fn(); 
    const renderedOutput = renderToString(<LoginReg onChildData={handleChildData} />);

    expect(renderedOutput).toContain('Registration');
    expect(renderedOutput).toContain('Login');
  });

  test('registers successfully with valid inputs', async () => {
    const handleChildData = jest.fn(); 

    render(<LoginReg onChildData={handleChildData} />);

    fireEvent.change(screen.getByTestId('userid-reg'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByTestId('username-reg'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByTestId('userpwd-reg'), {
      target: { value: 'password' },
    });
    fireEvent.change(screen.getByTestId('usercpwd-reg'), {
      target: { value: 'password' },
    });

    axios.post.mockResolvedValueOnce({
      data: { message: 'Successfully registered' },
    });

    fireEvent.click(screen.getByTestId('register-button'));

    await screen.findByText('Successfully registered');
    expect(screen.getByText('Successfully registered')).toBeInTheDocument();
  });

  // Add more test cases for other scenarios, such as empty fields, server errors, etc.

  test('logs in successfully with valid inputs', async () => {
    const handleChildData = jest.fn(); // Mock the onChildData function
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  
    render(<LoginReg onChildData={handleChildData} />);
  
    fireEvent.change(screen.getByTestId('userid-login'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByTestId('userpwd-login'), {
      target: { value: 'password' },
    });
    // Mock the Axios request for login
    axios.post.mockResolvedValueOnce({
      data: [{user_id: '123', user_name: 'testuser'}],
    });
    // Mock the Axios request for checking admin status
    axios.get.mockResolvedValueOnce({data: [{},],});
  
    fireEvent.click(screen.getByTestId('login-button'));
    await sleep(500);
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  
    expect(localStorage.getItem("loggedInUsername")).toBe('testuser');
  });
});