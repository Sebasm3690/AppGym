import { Tabs } from 'expo-router';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import '../../global.css';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, //Oculta el encabezado de la pestaña
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#60a5fa', // Azul brillante de selección
        tabBarInactiveTintColor: '#9ca3af', // gris claro de inactividad
        tabBarStyle: {
          position: 'absolute', //Posición absoluta para que no ocupe espacio
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
        },
        //Aqui se inyecta el Glassmorphim nativo de Expo a la barra
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={90}
            style={StyleSheet.absoluteFillObject}
          />
        ),
      }}
    >
      {/* PESTAÑA 1: Dashboard */}
      <Tabs.Screen
        name="dashboard" //Debe coincidir con el nombre del archivo
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      {/* PESTAÑA 2: Rutinas */}
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Rutinas',
          tabBarLabel: 'Rutinas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="weight-lifter"
              size={size}
              color={color}
            />
          ),
        }}
      />
      {/* PESTAÑA 3: Nutrición */}
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrición',
          tabBarLabel: 'Nutrición',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="food-apple-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
