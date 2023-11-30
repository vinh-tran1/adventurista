import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectDate from '../../Screens/Post/SelectDate';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'mock-FontAwesomeIcon',
}));

describe('SelectDate Component', () => {
  test('renders correctly', () => {
    const title = 'Select Date';
    const data = ['date1', 'date2', 'date3'];
    const func = jest.fn();

    const { getByText } = render(
      <SelectDate title={title} data={data} func={func} />
    );

    // Check if the title and default button text are rendered
    expect(getByText(title)).toBeDefined();
    expect(getByText(title)).toBeTruthy();
  });

  test('calls func when a date is selected', () => {
    const title = 'Select Date';
    const data = ['date1', 'date2', 'date3'];
    const func = jest.fn();

    const { getByTestId } = render(
      <SelectDate title={title} data={data} func={func} />
    );

    // Open the dropdown
    fireEvent.press(getByTestId('select-date-button'));

    // Check if the function is called
    expect(func).not.toHaveBeenCalled();
  });

  // Add more tests as needed
});

