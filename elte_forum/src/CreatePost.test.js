import React from 'react';
import { renderToString } from 'react-dom/server';
import { BrowserRouter as Router } from 'react-router-dom';
import CreatePost from './CreatePost';
import '@testing-library/jest-dom/extend-expect'; 

jest.mock('axios');
describe('CreatePost', () => { 
    test('Render check for CreatePost page', async () => {
        const handleChildData = jest.fn(); // Mock the onChildData function
        const renderedOutput = renderToString(<Router><CreatePost onChildData={handleChildData} /></Router>);
        expect(renderedOutput).toContain('class="create-post"');
    });
});