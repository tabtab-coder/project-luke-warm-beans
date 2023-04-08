import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import DropButton, {API} from './DropButton';

const setup = () => {
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

  // mock course id
  const courseID = {
    "id": "5f9f89d2c6370973b4f32222"
  };
  
  const utils = render(
    <DropButton
      course={courseID}
    />
  );
  
  return {
    ...utils
  }
}

test('renders drop button', () => {
  const { getByText } = setup();
  const button = getByText("Drop");
  expect(button).toBeInTheDocument();
});

test('clicking button opens popup, clicking no closes popup', () => {
  const { getByText } = setup();
  // clicking Drop opens popup
  const dropButton = getByText("Drop");
  fireEvent.click(dropButton);
  const header = getByText("Are you sure you want to drop this course?")
  expect(header).toBeInTheDocument();
  // clicking no closes popup
  const noButton = getByText("No");
  fireEvent.click(noButton);
  expect(header).not.toBeInTheDocument();
});

test('clicking yes on popup makes disenroll course API call', async () => {
  const getFunc = jest.spyOn(API, 'dropCourse').mockImplementationOnce(() => {
    return Promise.resolve();
  })

  const { getByText } = setup();
  const dropButton = getByText("Drop");
  fireEvent.click(dropButton);
  const yesButton = getByText("Yes");
  fireEvent.click(yesButton);

  await wait (() => expect(getFunc).toHaveBeenCalled());
});
