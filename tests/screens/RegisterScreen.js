import React from 'react';
import fetchMock from 'fetch-mock';
import { render, waitForElement, fireEvent, screen } from 'react-native-testing-library';
import { axiosInstance} from '../../app/api';
import { RegisterScreen } from '../../app/screens/RegisterScreen';

test("all elements exist", async() => {
    const component = render(<RegisterScreen/>)
    
    const firstname = await screen.findByText('First Name')
    expect(firstname).toBeOnTheScreen();
})