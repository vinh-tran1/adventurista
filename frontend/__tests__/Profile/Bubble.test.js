import React from 'react';
import { render } from '@testing-library/react-native';
import Bubble from '../../Screens/Profile/Bubble';

describe('Bubble Component', () => {
  test('renders correctly with provided props', () => {
    const props = {
      value: '42',
      name: 'Food',
    };

    const { getByText, getByTestId } = render(<Bubble {...props} />);

    // Check if the bubble text is rendered
    const bubbleText = getByText(props.value);
    expect(bubbleText).toBeTruthy();

    // Check if the name text is rendered
    const nameText = getByText(props.name);
    expect(nameText).toBeTruthy();

    // Check if the bubble component is rendered
    const bubbleComponent = getByTestId('bubble-component');
    expect(bubbleComponent).toBeTruthy();

  });
});
