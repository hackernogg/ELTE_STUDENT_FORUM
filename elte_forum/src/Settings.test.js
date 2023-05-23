import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import axios from 'axios';
import Settings from './Settings.js';
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
describe('Settings', () => { 
    test('Render check for Settings page', async () => {
        const handleChildData = jest.fn(); // Mock the onChildData function
        const renderedOutput = renderToString(
              <Settings onChildData={handleChildData}/>
          );
        expect(renderedOutput).toContain('Settings');
        expect(renderedOutput).toContain('Change Username');
        expect(renderedOutput).toContain('Change Password');
      });
      test('updates username successfully on form submission', async () => {
        const storedUserid = '123'; // Set the storedUserid
        const newUsername = 'newusername'; // Set the new username value
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        // Mock the Axios request for updating username
        axios.post.mockResolvedValueOnce({
          data: { message: 'Username updated successfully' },
        });
        // Render the component
        render(<Settings />);
        // Simulate user input
        fireEvent.change(screen.getByTestId('username-change'), {
          target: { value: newUsername },
        });
        // Trigger the form submission
        fireEvent.submit(screen.getByTestId('username-change-button'));
        await sleep(500);
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        expect(localStorage.getItem("loggedInUsername")).toBe(newUsername);
      });
});

