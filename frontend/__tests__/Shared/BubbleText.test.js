import React from 'react';
import { render } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { toHaveStyle } from '@testing-library/jest-native';
expect.extend({ toHaveStyle });
import BubbleText from '../../Shared/BubbleText';

describe('BubbleText component', () => {
  test('renders correctly with default styles', () => {
    const { getByText, getByTestId } = render(<BubbleText title="Test Title" />);
    
    // Check if the title is rendered
    const titleElement = getByText('Test Title');
    expect(titleElement).toBeDefined();

    // Check if the container has the default styles
    const containerElement = getByTestId('bubble-text-container');
    expect(containerElement).toHaveStyle({
      alignItems: 'center',
      backgroundColor: '#EDDBFF',
      paddingHorizontal: 17.5,
      paddingVertical: 7.5,
      borderRadius: 20,
      marginRight: 7.5,
    });
  });

  test('renders correctly with selectedTag styles when disabled is true', () => {
    const { getByTestId } = render(<BubbleText title="Test Title" disabled={true} />);
    
    // Check if the container has the selectedTag styles
    const containerElement = getByTestId('bubble-text-container');
    expect(containerElement).toHaveStyle({
      alignItems: 'center',
      backgroundColor: '#D186FF',
      paddingHorizontal: 17.5,
      paddingVertical: 7.5,
      borderRadius: 20,
      marginRight: 7.5,
    });
  });
});
