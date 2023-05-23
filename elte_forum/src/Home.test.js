import React from 'react';
import { renderToString } from 'react-dom/server';
import axios from 'axios';
import Home from './Home';
import '@testing-library/jest-dom/extend-expect'; 

jest.mock('axios');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
describe('Home', () => {
    test('Render check for home post page', async () => {
        const handleChildData = jest.fn(); 
        const renderedOutput = renderToString(<Home onChildData={handleChildData} />);
        expect(renderedOutput).toContain('class="home"');
        expect(renderedOutput).toContain('class="pagination"');
        expect(renderedOutput).toContain('class="post-list"');
    });

    test('Page number update check', async () => {
        const mockResponse = {
          data: {
            posts: [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }],
            totalCount: 2,
          },
        };
        axios.get.mockResolvedValueOnce(mockResponse); // Mock the Axios get method with the mockResponse
        await sleep(500);
        const handleChildData = jest.fn(); // Mock the onChildData function
        const renderedOutput = renderToString(<Home onChildData={handleChildData} />);
    
        // Assert that the Axios get method was called with the expected parameters
        expect(renderedOutput).toContain("Page 1");
      });
});