import React from 'react';
import { render } from '@testing-library/react';
import Home, {LOC} from './Home';

test('renders home page', () => {

  var apiFunc = jest.spyOn(LOC, 'useQuery').mockImplementationOnce(() => {
    return new URLSearchParams();
  })

  const { getAllByText, getByText } = render(<Home/>);
   expect(getByText(/Learn More About What U-Impactify Does/)).toBeInTheDocument();
});
  

