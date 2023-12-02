// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import '@testing-library/jest-native/extend-expect';
// import Post from '../../Screens/Post/Post';
// // Mock Axios
// import axios from 'axios';
// jest.mock('axios');

// // Mock Redux useSelector and useDispatch
// import { useSelector, useDispatch } from 'react-redux';
// jest.mock('react-redux');

// describe('Post Component', () => {
//   let mockUser, mockDispatch;

//   beforeEach(() => {
//     mockUser = {
//       userId: 'mockUserId',
//       // Other user properties...
//     };

//     mockDispatch = jest.fn();
//     useDispatch.mockReturnValue(mockDispatch);

//     // Provide the correct state structure in the useSelector mock
//     useSelector.mockImplementation((selector) => selector({ user: mockUser }));
//   });

//   test('renders correctly', () => {
//     const { getByText, getByPlaceholderText, getByTestId } = render(<Post navigation={{ navigate: jest.fn() }} />);

//     // Check if UI elements are rendered
//     expect(getByText('New Event')).toBeTruthy();
//     expect(getByText('Clear')).toBeTruthy();
//     expect(getByText('Event Details')).toBeTruthy();
//     expect(getByText('Post')).toBeTruthy();
//     expect(getByPlaceholderText('Event Name')).toBeTruthy();
//     // Add more assertions for other UI elements...
//   });

//   test('handles text input changes', () => {
//     const { getByPlaceholderText } = render(<Post navigation={{ navigate: jest.fn() }} />);

//     // Update event name input
//     const eventNameInput = getByPlaceholderText('Event Name');
//     fireEvent.changeText(eventNameInput, 'Test Event');
//     expect(eventNameInput.props.value).toBe('Test Event');

//     // Update location input
//     const locationInput = getByPlaceholderText('Location');
//     fireEvent.changeText(locationInput, 'Test Location');
//     expect(locationInput.props.value).toBe('Test Location');

//     // Update caption input
//     const captionInput = getByPlaceholderText('Describe the event!');
//     fireEvent.changeText(captionInput, 'Test Caption');
//     expect(captionInput.props.value).toBe('Test Caption');
//   });

// });
