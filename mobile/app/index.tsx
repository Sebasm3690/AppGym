import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import api from '@/src/services/api';
import * as SecureStore from 'expo-secure-store';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const backgroundImage = require('../assets/images/loginGym.jpg');
  // 1. Traducción del `this.state` a Hooks funcionales
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Traducción de `this.handleSubmit`
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor, ingrese usuario y contraseña');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/clientLogin/', {
        username,
        password,
      });

      // Extraemos exactamente lo mismo que en tu web
      const { access, refresh, cliente } = response.data;

      console.log('Token Access:', access);
      console.log('Token Refresh:', refresh);
      console.log('Cliente:', cliente);

      if (access) {
        // Traducción de `localStorage.setItem` a almacenamiento seguro móvil
        await SecureStore.setItemAsync('access', access);
        await SecureStore.setItemAsync('refresh', refresh);

        // SecureStore solo guarda strings, así que convertimos el ID y el objeto cliente
        await SecureStore.setItemAsync(
          'idCliente',
          cliente.id_cliente.toString(),
        );
        await SecureStore.setItemAsync('userRole', JSON.stringify(cliente));
        // SweetAlert no existe en móvil nativo, usamos Alert de React Native
        Alert.alert(
          'Inicio de sesión exitoso',
          'Bienvenido al panel del cliente!',
          [
            {
              text: 'Entrar',
              // Traducción de `this.navigate("/homeCliente/")` a Expo Router
              onPress: () => router.replace('/(tabs)/dashboard'),
            },
          ],
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        'Hubo un problema al validar tus credenciales. Inténtelo nuevamente.';
      Alert.alert('Error de inicio de sesión', errorMessage);
      console.log('Error al iniciar sesión', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      className="flex-1"
    >
      {/* CAPA OSCURA (OVERLAY) para legibilidad */}
      {/* bg-black/60 aplica un fondo negro con 60% de opacidad */}
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <BlurView
          intensity={60}
          tint="dark" // Le da un toque más profesional al vidrio
          className="w-full max-w-sm p-8 rounded-3xl border border-white/20 overflow-hidden"
        >
          {/* Tu formulario existente (con ligeros cambios de color para contraste) */}
          <Text className="text-4xl font-bold text-center mb-2 text-white tracking-tight uppercase">
            Iniciar Sesión
          </Text>
          <Text className="text-base text-gray-200 font-medium text-center mb-10 tracking-widest uppercase">
            Introduzca sus datos de cliente
          </Text>
          <View className="w-full space-y-6">
            <View className="flex-row items-center w-full bg-white/10 border border-white/20 rounded-xl p-4 mb-4">
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color="9ca3af"
              />
              <TextInput
                className="flex-1 text-white text-lg ml-3 py-3"
                placeholder="Nombre de usuario"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#9ca3af" // Color gris para el placeholder
              />
            </View>
            <View className="flex-row items-center w-full bg-white/10 border-white/20 rounded-xl p-4 mb-4">
              <MaterialCommunityIcons
                name="lock-outline"
                size={24}
                color="9ca3af"
              />
              <TextInput
                className="flex-1 text-white text-lg ml-3 py-3"
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9ca3af" // Color gris para el placeholder
              />
            </View>

            <TouchableOpacity
              className={`w-full p-4 rounded-xl items-center justify-center flex-row ${loading ? 'bg-blue-500/80' : 'bg-blue-600'} `}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fffff" className="mr-2" />
              ) : null}
              <Text className="text-white font-bold text-lg uppercase tracking-wider">
                {loading ? 'Validando...' : 'Ingresar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-4 items-center">
              <Text className="text-gray-300 font-medium text-sm">
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </ImageBackground>
  );
}
