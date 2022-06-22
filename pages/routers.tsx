import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PassList from './passList';
import CreatePass from './createPass';
import { createGlobalToken, getValueFor, getData } from "../store/secureStore"
import { getFreeDiskStorageAsync } from 'expo-file-system';

import {NinePassData} from "./createPass"


const Stack = createNativeStackNavigator();

global.data = getData("DATA")

export type RootStackParamList = {
  PassList: undefined;
  CreatePass: NinePassData | undefined;
};


const Routers = () => {
  useEffect(() => {
    let token = getValueFor("GlobalToken")
    if (!token) {
      createGlobalToken()
    }
  }, [])

  // useEffect(() => {
  //   const fetchDdata = async () => {
  //     let data = await getData("DATA")
  //     console.log("=================>")
  //     global.data = data
  //   }
  //   fetchDdata()
  // }, [global.data])

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