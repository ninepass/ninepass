import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PassList from './passList';
import CreatePass from './createPass';
import { createGlobalToken, getValueFor, getData } from "../store/secureStore"


import { NinePassData } from "./createPass"
import { Dialog } from '@rneui/themed';


const Stack = createNativeStackNavigator();


export type RootStackParamList = {
  PassList: undefined;
  CreatePass: NinePassData | undefined;
};


const Routers = () => {
  let [progress, setProgress] = useState(false)
  useEffect(() => {
    let token = getValueFor("GlobalToken")
    if (!token) {
      createGlobalToken()
    }
  }, [])


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="PassList"
          component={PassList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreatePass"
          component={CreatePass}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routers;