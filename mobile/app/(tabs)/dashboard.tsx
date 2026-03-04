import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router/build/exports';
export default function DashboardScreen() {
  const backgroundImage = require('../../assets/images/loginGym.jpg');
  const nombreUsuario = 'Nombre';
  const caloriasConsumidas = 2500;
  const caloriasMeta = 2800;
  const progresoCalorias = (caloriasConsumidas / caloriasMeta) * 100;
  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      className="flex-1"
    >
      {/* Capa oscura un poco más transparente que en el login para darle respiro al contenido */}
      <View className="flex-1 bg-black/70">
        <ScrollView
          className="flex-1 px-6 pt-12 pb-24"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER: Saludo */}
          <View className="flex-row justify-between items-center mb-8 mt-4">
            <View>
              <Text className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
                Hora de entrenar!
              </Text>
              <Text className="text-3xl font-bold text-white tracking-tight">
                Hola, {nombreUsuario}
              </Text>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-white/10 rounded-full items-center justify-center border border-white/20">
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
          {/* BANNER DE PROGRESO (Glassmorphism) */}
          <BlurView
            intensity={40}
            tint="dark"
            className="w-full p-6 rounded-3xl border border-white/20 overflow-hidden mb-8"
          >
            <View className="flex-row justify-between items-end mb-4">
              <View>
                <Text className="text-white font-bold text-lg mb-1">
                  Control de Voluen
                </Text>
                <Text className="text-gray-300 text-sm">Calorías del día</Text>
              </View>
              <Text className="text-blue-400 font-bold text-xl">
                {caloriasConsumidas}{' '}
                <Text className="text-sm text-gray-400">
                  /{caloriasMeta} kcal
                </Text>
              </Text>
            </View>

            {/* Barra de progreso visual */}

            <View className="w-full bg-black/50 h-3 rounded-full overflow-hidden">
              <View
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${progresoCalorias}%` }}
              ></View>
            </View>
          </BlurView>

          <Text className="text-white font-bold text-xl mb-4 tracking-wide">
            Qué haremos hoy?
          </Text>

          {/* TARJETA 1: RUTINAS */}
          {/*View y BlurView -> Dimension, background, bordes y orientación*/}
          {/*Text -> Color, bold o no, tamaño*/}
          {/*Icono -> Nombre, tamaño y color*/}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/workout')}
            className="mb-4"
          >
            <BlurView
              intensity={30}
              tint="dark"
              className="w-full p-5 rounded-3xl border border-white/10 flex-row items-center overflow-hidden"
            >
              <View className="w-16 h-16 bg-blue-600/20 rounded-2xl items-center justify-center border border-blue-500/30">
                <MaterialCommunityIcons
                  name="weight-lifter"
                  size={32}
                  color="#60a5fa"
                />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white font-bold text-lg">
                  Mis rutinas
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Registra tus cargas y series
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#9ca3af"
              />
            </BlurView>
          </TouchableOpacity>

          {/* TARJETA 2: CONTROL CALÓRICO */}
          <TouchableOpacity
            activeOpacity={0.8}
            //onPress={() => router.push('/(tabs)/calories')}
            className="mb-4"
          >
            <BlurView
              intensity={30}
              tint="dark"
              className="w-full flex-row items-center p-5 rounded-3xl border border-white/10 overflow-hidden"
            >
              <View className="w-full items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl border border-blue-500/30">
                <MaterialCommunityIcons
                  name="food-apple-outline"
                  size={32}
                  color="#60a5fa"
                />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white font-bold text-xl">Nutrición</Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Controla tus calorías
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#9ca3af"
              />
            </BlurView>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
