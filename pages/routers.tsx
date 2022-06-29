import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PassList from './passList';
import CreatePass from './createPass';
import { createGlobalToken, getValueFor, getData } from "../store/secureStore"


import { NinePassData } from "./createPass"
import { Dialog } from '@rneui/themed';
import Settings from './setting';


const Stack = createNativeStackNavigator();


export type RootStackParamList = {
  PassList: undefined;
  CreatePass: NinePassData | undefined;
  Settings: NinePassData | undefined;
};


const Routers = () => {
  let [progress, setProgress] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      return await getValueFor("GlobalToken")
    }
    fetchData().then(token => {
      alert(token)
      if (!token) {
        createGlobalToken()
      } else {
        global.token = token
      }
    })

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
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routers;