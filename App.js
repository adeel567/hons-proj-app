import {Provider as PaperProvider, TextInput} from 'react-native-paper'
import {AppNavigator} from './app/AppNavigator';
import { AuthProvider } from './app/context/AuthContext';

const App = () => {
  return(
    <AuthProvider>
      <PaperProvider>
        <AppNavigator/>
      </PaperProvider>
    </AuthProvider>
  )
}

export default App;