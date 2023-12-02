import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Tags from '../../Screens/Post/Tags';

describe('Tags Component', () => {
  test('renders correctly', () => {
    const tags = ['tag1', 'tag2', 'tag3'];
    const select = jest.fn();
    const press = jest.fn();

    const { getByText } = render(
      <Tags tags={tags} select={select} press={press} />
    );

    // Check if the tags are rendered
    tags.forEach((tag) => {
      expect(getByText(tag)).toBeDefined();
    });
  });

  test('calls press function when a tag is pressed', () => {
    const tags = ['tag1', 'tag2', 'tag3'];
    const select = jest.fn();
    const press = jest.fn();

    const { getByText } = render(
      <Tags tags={tags} select={select} press={press} />
    );

    // Click on the first tag
    fireEvent.press(getByText('tag1'));

    // Check if the press function is called with the correct tag
    expect(press).toHaveBeenCalledWith('tag1');
  });

  // Add more tests as needed
});
