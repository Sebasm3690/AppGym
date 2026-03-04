# AppGym Mobile - Project Constitution (B.L.A.S.T. Data-First)

## 1. Project Overview

Aplicación móvil exclusiva para el rol "Cliente" del sistema AppGym.

- **Frontend Stack:** React Native (Expo CLI), Expo Router (File-based routing), TypeScript, NativeWind (Tailwind CSS), Zustand (o Context para estado global si es necesario), Axios, Expo Secure Store.
- **Backend:** API REST existente construida en Django (desplegada en Render). NO se debe modificar el backend.
- **Objetivo Principal:** Permitir al cliente registrar su control calórico diario (macros) y el peso/repeticiones de sus rutinas de hipertrofia en tiempo real desde el gimnasio.

## 2. Agent Core Directives (Antigravity & Superpowers)

- **Regla Data-First:** ESTÁ PROHIBIDO escribir código de interfaz (UI) sin antes validar que los datos cumplan con las interfaces de TypeScript definidas abajo.
- **Tipado Estricto:** Todo el código debe usar TypeScript. Prohibido el uso de `any`.
- **Componentes Nativos:** Usar exclusivamente componentes de React Native (`<View>`, `<Text>`, `<TouchableOpacity>`, `<TextInput>`). NUNCA usar etiquetas del DOM web (`<div>`, `<span>`, `<button>`).
- **Rendimiento en Listas:** Para iterar arrays de datos (historial de rutinas, catálogo de alimentos), es OBLIGATORIO usar `<FlatList>`. Está prohibido usar `.map()` dentro de un `<ScrollView>` para listas dinámicas.
- **Estilos:** Usar exclusivamente clases de Tailwind a través de la propiedad `className` (NativeWind).

## 3. Core Domain Models (TypeScript Interfaces)

El agente debe basarse en estos contratos de datos, extraídos de los modelos de Django:

```typescript
export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  tmb: number;
  altura: number;
  peso: number;
  carbohidratos_g: number;
  proteina_g: number;
  grasas_g: number;
  // Campos omitidos por brevedad visual, referirse al backend para payload completo
}

export interface Alimento {
  id_alimento: number;
  nombre: string;
  calorias: number;
  proteina_g: number;
  carbohidratos_g: number;
  grasa_g: number;
  metrica_g: number;
  unidad_medida: string;
}

export interface SeAsigna {
  id_rutina: number;
  id_ejercicio: number;
  id_cliente: number;
  serie: number;
  repeticiones: number;
  peso: number;
  fecha: string; // ISO 8601
  dia: string;
  tipo: string;
  asignado?: string;
}

export interface Dispone {
  id_dispone: number;
  id_cliente: number;
  id_alimento: number;
  id_parte_dia: number;
  cantidad: number;
  tamaño_porcion_g: string;
  gramos: number;
  fecha: string;
}
```
