import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import PassList from './pages/passList';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routers from './pages/routers';
import { createTheme, ThemeProvider,useThemeMode } from "@rneui/themed";
import { useEffect } from 'react';



const theme = createTheme({
  lightColors: {},
  darkColors: {
    primary: '#999',
  },
  mode:"light",
  Button: {
    titleStyle: {
      color: '#fff',
    },
  },
  ListItem:{
    
  }
});

export default function App() {


  return (

    
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
        <StatusBar style="auto" />
        <Routers />
        </ThemeProvider>
      </SafeAreaProvider>
   

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
