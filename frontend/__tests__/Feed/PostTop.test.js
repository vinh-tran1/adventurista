import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import PostTop from '../../Screens/Feed/PostTop';

// Mock Redux useSelector and useDispatch
import { useSelector, useDispatch } from 'react-redux';
jest.mock('react-redux');

describe('PostTop Component', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      title: 'Test Event',
      location: 'Test Location',
      img: 'https://example.com/test-image.jpg',
      createdBy: 'Test User',
      createdByObj: { userId: 'testUserId' },
      date: '01/01/2023',
      time: '12:00 PM',
      navigation: { navigate: jest.fn() },
    };

    // Provide the correct state structure in the useSelector mock
    useSelector.mockImplementation((selector) => selector({/* Your Redux state here */}));
  });

  test('renders the PostTop component', () => {
    const { getByText, getByTestId } = render(<PostTop {...mockProps} />);

    // Check if the title, location, and createdBy are rendered
    expect(getByText(mockProps.title)).toBeTruthy();
    expect(getByText(mockProps.location)).toBeTruthy();
    expect(getByText(`by ${mockProps.createdBy}`)).toBeTruthy();

    // Check if the date and time are rendered
    expect(getByText(mockProps.date)).toBeTruthy();
    expect(getByText(mockProps.time)).toBeTruthy();

    // Check if the "View Profile" button triggers the handleViewProfile function
    fireEvent.press(getByTestId('view-profile-button'));
    expect(mockProps.navigation.navigate).toHaveBeenCalledWith('FriendProfileView', {
      poster: mockProps.createdByObj,
    });
  });

  // Add more test cases as needed...

});
