import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper'
import {AppNavigator} from './app/AppNavigator';
import { AuthProvider } from './app/context/AuthContext';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    mode: 'light', // Set the default mode to "light"
  },
};


const App = () => {
  return(
    <AuthProvider>
      <PaperProvider theme={theme}>
        <AppNavigator/>
      </PaperProvider>
    </AuthProvider>
  )
}

export default App;