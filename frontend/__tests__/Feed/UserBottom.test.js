import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import UserBottom from '../../Screens/Feed/UserBottom';

describe('UserBottom Component', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      name: 'John Doe',
      age: 25,
      from: 'Cityville',
    };
  });

  test('renders the UserBottom component', () => {
    const { getByText, getByTestId } = render(<UserBottom {...mockProps} />);

    // Check if the name, age, and location are rendered
    expect(getByText(mockProps.name)).toBeTruthy();
    expect(getByText(mockProps.age.toString())).toBeTruthy();
    expect(getByText(`from ${mockProps.from}`)).toBeTruthy();

    // Check if the "Add Friend" button triggers the handleAddFriend function
    // fireEvent.press(getByTestId('add-friend-button'));
    // Add expectations related to handleAddFriend if needed...
  });

  // add more test cases as needed...

});
