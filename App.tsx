import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { RootNavigator } from './src/navigation';
import { Provider } from 'react-redux';
import { ThemeProvider } from './src/context';
import { store } from './src/store/store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <StatusBar translucent backgroundColor="transparent" />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
