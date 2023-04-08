import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ConfirmationPopup from './ConfirmationPopup';

const setup = () => {
  // mocking all the objects that are given as props to the popup
  const text = "I am a title";
  const desc = "This description describes";
  const yesOption = jest.fn((values) => {});
  const noOption = jest.fn((values) => {});

  const utils = render(
    <ConfirmationPopup
      text={text}
      description={desc}
      yesOption={yesOption}
      noOption={noOption}
    />
  );
  
  return {
    yesOption,
    noOption,
    ...utils
  }
}

test('buttons call appropriate functions', () => {
  const { getByText, yesOption, noOption } = setup();
  // clicking yes calls yesOption
  const yesButton = getByText("Yes");
  fireEvent.click(yesButton);
  expect(yesOption).toHaveBeenCalled();
  // clicking no calls noOption
  const noButton = getByText("No");
  fireEvent.click(noButton);
  expect(noOption).toHaveBeenCalled();
});
