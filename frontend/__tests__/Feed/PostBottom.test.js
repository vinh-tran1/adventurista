import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import PostBottom from '../../Screens/Feed/PostBottom';

// Mock Redux useSelector and useDispatch
import { useSelector, useDispatch } from 'react-redux';
jest.mock('react-redux');

// Mock Axios
import axios from 'axios';
jest.mock('axios');

describe('PostBottom Component', () => {
  let mockTags, mockCaption, mockEventId;
  let mockUser, mockDispatch;

  beforeEach(() => {
    mockTags = ['tag1', 'tag2', 'tag3'];
    mockCaption = 'Test caption';
    mockEventId = 'testEventId';

    mockUser = {
      userId: 'mockUserId',
      eventsGoingTo: ['1', '2'], // Ensure eventsGoingTo is defined as an array
      eventsSaved: ['1', '2']
      // other user properties...
    };

    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    // Provide the correct state structure in the useSelector mock
    useSelector.mockImplementation((selector) => selector({ userInfo: mockUser }));
  });

  test('handles attend event button press', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { eventId: '123' },
    });
  
    const { getByTestId } = render(
      <PostBottom caption={mockCaption} tags={mockTags} eventId={mockEventId} />
    );
  
    // Trigger press event on the attend button
    fireEvent.press(getByTestId('attend-button'));
  
    // Wait for promises to resolve
    await waitFor(() => {});
  
    // Check if dispatch is called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_USER_INFO',
      payload: {
        eventId: '123',
        newPost: false,
    }});
  });

  test('handles save event button press', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { eventId: '123' },
    });
  
    const { getByTestId } = render(
      <PostBottom caption={mockCaption} tags={mockTags} eventId={mockEventId} />
    );
  
    // Trigger press event on the save button
    fireEvent.press(getByTestId('save-button'));
  
    // Wait for promises to resolve
    await waitFor(() => {});
  
    // Check if dispatch is called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_USER_INFO',
      payload: {
        eventId: '123',
        newPost: false,
    }});
  });

  test('handles save event button press - failure', async () => {

    const consoleSpy = jest.spyOn(console, 'log');

    axios.post.mockRejectedValue(new Error('Failed to save event'));

    const { getByTestId } = render(
      <PostBottom caption={mockCaption} tags={mockTags} eventId={mockEventId} />
    );

    // Trigger press event on the save button
    fireEvent.press(getByTestId('save-button'));

    // Wait for promises to reject
    await waitFor(() => {});

    // Check if the error message is logged
    expect(consoleSpy).toHaveBeenCalledWith("An error occurred while saving this event to your saved events list. Please try again.");

    // Check if dispatch is not called in case of failure
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test('handles save event button press - failure', async () => {

    const consoleSpy = jest.spyOn(console, 'log');

    axios.post.mockRejectedValue(new Error('Failed to attend event'));

    const { getByTestId } = render(
      <PostBottom caption={mockCaption} tags={mockTags} eventId={mockEventId} />
    );

    // Trigger press event on the save button
    fireEvent.press(getByTestId('attend-button'));

    // Wait for promises to reject
    await waitFor(() => {});

    // Check if the error message is logged
    expect(consoleSpy).toHaveBeenCalledWith("An error occurred while adding this event to your calendar. Please try again.");

    // Check if dispatch is not called in case of failure
    expect(mockDispatch).not.toHaveBeenCalled();
  });


  test('renders tags, caption, and buttons', () => {
    const { getByText, getByTestId } = render(
      <PostBottom caption={mockCaption} tags={mockTags} eventId={mockEventId} />
    );

    // Check if tags are rendered
    mockTags.forEach((tag) => {
      expect(getByText(tag)).toBeTruthy();
    });

    // Check if caption is rendered
    expect(getByText(mockCaption)).toBeTruthy();

    // Check if buttons are rendered
    expect(getByTestId('attend-button')).toBeTruthy();
    expect(getByTestId('save-button')).toBeTruthy();
  });

});
