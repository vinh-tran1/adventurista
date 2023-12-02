import React from 'react';
import { render } from '@testing-library/react-native';
import AttendingUser from '../../Shared/AttendingUser';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: 'div', // Provide a simple mock for FontAwesomeIcon
  }));
  
describe('AttendingUser component', () => {
  const mockUser = {
    firstName: 'Vinh',
    // other properties if needed
  };

  test('renders correctly', () => {
    const { getByText, getByTestId } = render(<AttendingUser user={mockUser} />);

    // Check if user's first name is rendered
    const firstNameElement = getByText('Vinh');
    expect(firstNameElement).toBeDefined();

    // Check if the profile picture is rendered
    // const profilePicElement = getByTestId('profile-pic');
    // expect(profilePicElement).toBeDefined();

    // Check if the "user-plus" icon is rendered
    const userPlusIcon = getByTestId('user-plus-icon');
    expect(userPlusIcon).toBeDefined();
  });

  // You can add more tests to check user interactions or additional component behavior
});
