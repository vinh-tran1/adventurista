import getAge from "../../Shared/GetAge";

describe('getAge function', () => {
  test('calculates age correctly', () => {
    const mockCurrentDate = '2023-11-28';
    const age = getAge(mockCurrentDate);
    const expectedAge = 0;
    expect(age).toEqual(expectedAge);
  });
});
