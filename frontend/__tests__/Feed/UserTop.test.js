import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import UserTop from '../../Screens/Feed/UserTop';

describe('UserTop Component', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      createdByObj: {
        user: {
            userId: '123',
            firstName: 'Vinh',
            lastName: 'Tran'
        }
      },
      profile_pic: 'https://example.com/profile-pic.jpg',
      interests: ['Interest1', 'Interest2', 'Interest3'],
      navigation: {
        navigate: jest.fn(),
      },
    };
  });

  test('renders the UserTop component', () => {
    const { getByText, getByTestId, getAllByTestId } = render(<UserTop {...mockProps} />);

    // Check if the "View Profile" button triggers the handleViewProfile function
    fireEvent.press(getByTestId('view-profile-button'));
    // Add expectations related to handleViewProfile if needed...

    // Check if the number of interests rendered is correct
    const interestBubbles = getAllByTestId('bubble-text-container');
    expect(interestBubbles.length).toBe(mockProps.interests.length);

    // Add more test cases as needed...
  });

  // Add more test cases as needed...

});
