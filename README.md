# Sorteos FaciFacilísimo

¡Bienvenido a **Sorteos FaciFacilísimo**! Esta aplicación web te permite realizar sorteos de Instagram, Facebook y listas de nombres de manera fácil, rápida y transparente.

## 🚀 Características principales
- **Previsualización de imágenes**: Ve la imagen de tu publicación de Instagram antes de comenzar.
- **Múltiples fuentes de datos**: 
  - Comentarios de Instagram (.txt)
  - Comentarios de Facebook (.txt)
  - Lista de nombres personalizada (.txt)
- **Filtros avanzados**:
  - Selección aleatoria
  - Búsqueda por número específico
  - Búsqueda por palabra clave
  - Búsqueda por marcador/símbolo
- **Procesamiento inteligente**: Separa automáticamente nombres por líneas y comas.
- **Sorteos justos y transparentes** con resultados verificables.
- **Descarga en PDF** con marca de agua personalizada.
- **Interfaz moderna y responsiva** con notificaciones visuales.
- **Soporte multi-plataforma**: Instagram, Facebook, o ambos simultáneamente.

## 📁 Estructura del proyecto

```
/src
  ├── assets/           # Imágenes y recursos estáticos
  ├── components/       # Componentes reutilizables
  │   ├── CommentsTable.tsx      # Tabla de comentarios
  │   ├── FileUploaderProps.tsx  # Cargador de archivos
  │   ├── Filters.tsx            # Filtros para Instagram
  │   ├── FiltersFacebook.tsx    # Filtros para Facebook
  │   ├── HeaderLogo.tsx         # Logo del header
  │   ├── ScrollToTop.tsx        # Botón scroll to top
  │   └── WinnerDialog.tsx       # Diálogo de ganadores
  ├── hooks/            # Custom hooks de React
  ├── pages/            # Páginas principales
  │   ├── HomePage.tsx           # Página de inicio
  │   ├── SorteoPage.tsx         # Página de sorteo
  │   └── GanadoresPage.tsx      # Página de ganadores
  ├── routes/           # Definición de rutas
  ├── UI/               # Componentes de UI y estilos
  ├── utils/            # Utilidades y helpers
  │   └── commentParser.ts       # Parser de comentarios
  ├── App.tsx           # Componente raíz
  ├── main.tsx          # Punto de entrada
  └── index.css         # Estilos globales
```

## 🛠️ Tecnologías utilizadas
- **React 18** + **TypeScript**
- **Vite** (entorno de desarrollo rápido)
- **PrimeReact** (componentes UI y notificaciones)
- **jsPDF** y **jspdf-autotable** (exportación a PDF)
- **react-icons** (iconografía)
- **Tailwind CSS** (estilos y diseño responsivo)
- **React Router** (navegación)

## ⚙️ Instalación y ejecución local

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd sorteos-facifacilisimo
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecuta la aplicación en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Construye para producción:**
   ```bash
   npm run build
   ```

5. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📄 Guía de uso

### 1. **Página de Inicio (HomePage)**
- Pega el enlace de tu publicación de Instagram
- Previsualiza la imagen de la publicación
- Sube archivos de comentarios:
  - **Instagram**: Archivo .txt con comentarios de Instagram
  - **Facebook**: Archivo .txt con comentarios de Facebook
  - **Nombres**: Archivo .txt con lista de nombres personalizada
- Selecciona la plataforma o tipo de sorteo

### 2. **Página de Sorteo (SorteoPage)**
- Visualiza estadísticas en tiempo real
- Aplica filtros avanzados:
  - **Aleatorio**: Selección completamente aleatoria
  - **Número**: Busca comentarios que contengan números específicos
  - **Palabra**: Busca comentarios que contengan palabras clave
  - **Marcador**: Busca comentarios que contengan símbolos específicos
- Configura el número de ganadores
- Realiza el sorteo

### 3. **Página de Ganadores (GanadoresPage)**
- Visualiza los ganadores seleccionados
- Descarga el resultado en PDF
- Comparte los resultados

## 📋 Formatos de archivos soportados

### **Comentarios de Instagram/Facebook**
```
usuario1
comentario del usuario 1
fecha1

usuario2
comentario del usuario 2
fecha2
```

### **Lista de nombres**
```
Juan Pérez
María García
Carlos López
Ana Martínez
```

**O en formato separado por comas:**
```
Juan Pérez, María García, Carlos López, Ana Martínez
```

**O combinando ambos formatos:**
```
Juan Pérez, María García
Carlos López, Ana Martínez
Pedro Rodríguez
```

## 🔧 Características técnicas

### **Procesamiento de nombres**
- Separación automática por líneas y comas
- Eliminación de espacios en blanco
- Filtrado de entradas vacías
- Conversión a objetos CommentBlock para consistencia

### **Filtros avanzados**
- **Aleatorio**: Algoritmo Fisher-Yates para mezcla justa
- **Número**: Búsqueda exacta o con permutaciones
- **Palabra**: Búsqueda case-insensitive
- **Marcador**: Búsqueda de símbolos específicos

### **Persistencia de datos**
- localStorage para datos temporales
- Gestión de múltiples plataformas
- Preservación de criterios de búsqueda

## 📦 Dependencias principales
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x",
  "vite": "^4.x",
  "primereact": "^10.x",
  "primeicons": "^6.x",
  "jspdf": "^2.x",
  "jspdf-autotable": "^3.x",
  "react-icons": "^4.x",
  "react-router-dom": "^6.x",
  "tailwindcss": "^3.x"
}
```

## 🚀 Despliegue

### **Vercel (Recomendado)**
1. Conecta tu repositorio a Vercel
2. Configuración automática con `vercel.json`
3. Despliegue automático en cada push

### **Configuración de Vercel**
```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } }
  ],
  "routes": [
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/images/(.*)", "dest": "/images/$1" },
    { "src": "/icono-img-removebg-preview.ico", "dest": "/icono-img-removebg-preview.ico" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## ❓ FAQ

**¿Qué formatos de archivo soporta la aplicación?**
> Solo archivos `.txt` con comentarios o nombres. Los nombres pueden estar separados por líneas o comas.

**¿Puedo usar la app sin subir una imagen?**
> No, la imagen es requerida para habilitar la carga de archivos y mantener la transparencia del sorteo.

**¿Cómo funciona el procesamiento de nombres?**
> La app separa automáticamente los nombres por líneas y comas, eliminando espacios en blanco y entradas vacías.

**¿Puedo combinar comentarios de Instagram y Facebook?**
> Sí, puedes subir ambos archivos y seleccionar "Continuar" para usar ambas fuentes.

**¿Los sorteos son realmente aleatorios?**
> Sí, utilizamos el algoritmo Fisher-Yates para garantizar una mezcla justa y transparente.

**¿Puedo usar la app en dispositivos móviles?**
> Sí, la interfaz es completamente responsiva y optimizada para móviles.

## 🆘 Soporte y contacto

¿Tienes dudas, problemas o sugerencias?

- **Issues**: Abre un [issue](https://github.com/Fiutwer09) en este repositorio
- **Email**: camilocardona2617@gmail.com
- **Soporte técnico**: Disponible a través de la aplicación

## 🔄 Historial de versiones

### **v2.0.0** (Actual)
- ✅ Soporte para listas de nombres personalizadas
- ✅ Procesamiento mejorado de archivos (líneas y comas)
- ✅ Interfaz optimizada con tres cargadores de archivos
- ✅ Filtros avanzados para todas las plataformas
- ✅ Despliegue optimizado en Vercel
- ✅ Corrección de errores de linter

### **v1.0.0**
- ✅ Sorteos básicos de Instagram y Facebook
- ✅ Exportación a PDF
- ✅ Interfaz responsiva

---

¡Gracias por usar **Sorteos FaciFacilísimo**! 🎉

*Hecho con ❤️ para hacer tus sorteos más fáciles, rápidos y transparentes.*
