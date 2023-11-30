jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'mocked-FontAwesomeIcon-component',
}));

jest.mock('react-native', () => {
    return {
      StyleSheet: {
        create: () => ({}),
      },
    };
  });

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
