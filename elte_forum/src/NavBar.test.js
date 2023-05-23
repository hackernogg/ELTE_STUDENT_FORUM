import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import Navbar from './Navbar';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';

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

  describe('Navbar', () => {
    test('Render check for Navbar', async () => {
        const handleChildData = jest.fn(); // Mock the onChildData function
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        const renderedOutput = renderToString(
            <BrowserRouter basename="/">
              <Navbar onChildData={handleChildData}/>
            </BrowserRouter>
          );
        expect(renderedOutput).toContain('ELTE Student Forum');
        expect(renderedOutput).toContain('class=\"navbar\"');
      });
    test('logs out successfully on button click', async () => {
        // Spy on the localStorage.removeItem method
        const handleChildData = jest.fn(); // Mock the onChildData function
        jest.spyOn(localStorage, 'removeItem');
        // Render the component
        render(
            <BrowserRouter basename="/">
              <Navbar onChildData={handleChildData}/>
            </BrowserRouter>
          );
        // Simulate a click on the logout button
        fireEvent.click(screen.getByText('➮'));
        await sleep(500);
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        expect(localStorage.removeItem).toHaveBeenCalledWith('isLoggedIn');
        expect(localStorage.removeItem).toHaveBeenCalledWith('loggedInUsername');
        expect(localStorage.removeItem).toHaveBeenCalledWith('isAdmin');

        expect(window.location.href).toBe("http://localhost/");
      });
});