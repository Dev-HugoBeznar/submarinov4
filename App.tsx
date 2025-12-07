import React from "react";
import HomeScreen from "./src/Screens/homeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import ConfigScreen from "./src/Screens/configScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen name="config" component={ConfigScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
