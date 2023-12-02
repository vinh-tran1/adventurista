import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import axios from 'axios';
import MyGroups from '../../Screens/Profile/MyGroups';

// Mock the axios module
jest.mock('axios');

// Mock console.log
console.log = jest.fn();

describe('MyGroups Component', () => {
  test('renders correctly', async () => {
    // Mock the response data for the axios request
    const mockResponse = {
      data: {
        eventId: 'string',
        title: 'Mocked Group Title',
        description: 'string',
        date: 'string',
        time: 'string',
        location: 'string',
        postingUserId: 'string',
        blockedUsers: ['1', '2'],
        whoIsGoing: ['3', '4'],
        tags: ['one'],
        eventPictureUrl: 'string'
      },
    };

    // Mock the axios.get method to resolve with the mockResponse
    axios.get.mockResolvedValue(mockResponse);

    // Render the MyGroups component
    const { getByText } = render(<MyGroups groupId="mockedGroupId" poster="mockedPoster" />);

    // Wait for the axios request to resolve
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    // Check if the title is rendered
    expect(getByText('Mocked Group Title')).toBeTruthy();
  });

  test('handles error correctly', async () => {
    // Mock the rejected promise for the axios request
    const mockError = new Error('Failed to fetch data');
    axios.get.mockRejectedValue(mockError);
  
    // Render the component
    const { getByTestId } = render(<MyGroups groupId="mockedGroupId" poster="mockedPoster" />);

    await Promise.resolve();
  
    expect(console.log).not.toHaveBeenCalledWith(mockError);
    expect(console.log).not.toHaveBeenCalledWith('cannot get event going to');
  });

});
