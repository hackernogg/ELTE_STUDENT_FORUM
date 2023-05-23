import React from 'react';
import { renderToString } from 'react-dom/server';
import { BrowserRouter as Router } from 'react-router-dom';
import PostDetails from './PostDetails';
import '@testing-library/jest-dom/extend-expect'; 

jest.mock('axios');
describe('PostDetails', () => { 
    test('Render check for PostDetails page', async () => {
        const handleChildData = jest.fn(); // Mock the onChildData function
        const renderedOutput = renderToString(<Router><PostDetails onChildData={handleChildData} /></Router>);
        expect(renderedOutput).toContain('class="post-details"');
    });
});