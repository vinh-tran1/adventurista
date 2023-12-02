import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PostTop from '../../Screens/Feed/PostTop';

describe('PostTop Component', () => {
  test('renders PostTop component with proper data', () => {
    const mockPostData = {
      title: 'Test Event',
      location: 'Test Location',
      img: 'https://example.com/test-image.jpg',
      createdBy: 'Test User',
      createdByObj: { userId: 'testUserId', firstName: 'Test', lastName: 'User' },
      date: '2023-12-01',
      time: '18:00',
      attendance: 5,
      navigation: { navigate: jest.fn() },
    };

    const { getByText, getByTestId } = render(<PostTop {...mockPostData} />);

    expect(getByText('Test Event')).toBeTruthy();
    expect(getByText('Test Location')).toBeTruthy();
    expect(getByText('by Test User')).toBeTruthy();
    expect(getByText('+5 others')).toBeTruthy();
    expect(getByText('2023-12-01')).toBeTruthy();
    expect(getByText('18:00')).toBeTruthy();
    expect(getByTestId('view-profile-button')).toBeTruthy();
  });

  test('handles view profile button click', () => {
    const mockPostData = {
      title: 'Test Event',
      location: 'Test Location',
      img: 'https://example.com/test-image.jpg',
      createdBy: 'Test User',
      createdByObj: { userId: 'testUserId', firstName: 'Test', lastName: 'User' },
      date: '2023-12-01',
      time: '18:00',
      attendance: 5,
      navigation: { navigate: jest.fn() },
    };

    const { getByTestId } = render(<PostTop {...mockPostData} />);

    // Simulate button click
    fireEvent.press(getByTestId('view-profile-button'));

    // Verify that the navigation function is called with the expected arguments
    expect(mockPostData.navigation.navigate).toHaveBeenCalledWith('FriendProfileView', { poster: mockPostData.createdByObj });
  });

  // Add more test cases as needed
});
