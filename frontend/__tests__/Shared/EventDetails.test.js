import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EventDetails from '../../Shared/EventDetails';

describe('EventDetails component', () => {
  const mockEvent = {
    title: 'Sample Event',
    location: 'Sample Location',
    time: '12:00 PM',
    whoIsGoing: [],
    // other properties if necessary
  };

  const mockPoster = {
    firstName: 'John',
     // other properties if necessary
  };

  test('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <EventDetails event={mockEvent} poster={mockPoster} />
    );

    // Check if event details are rendered
    expect(getByText('Sample Event')).toBeDefined();
    expect(getByText('Sample Location')).toBeDefined();
    expect(getByText('by John')).toBeDefined();

    // Check if attending users section is rendered
    expect(getByText('Attending 0')).toBeDefined();

    // Check if individual attending user components are rendered
    // expect(getByTestId('attending-user')).toBeDefined();
  });

  // Add more tests as needed to cover user interactions, navigation, etc.
});
