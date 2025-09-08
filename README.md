# Vinculación Sísmico Backend

API REST para el sistema de gestión de inspecciones sísmicas de edificios. Este backend proporciona servicios para la autenticación de usuarios, gestión de edificios, catálogos y administración de roles.

## Arquitectura

El proyecto sigue una arquitectura limpia con separación de responsabilidades:

```
lib/
├── controllers/     # Controladores HTTP
├── services/        # Lógica de negocio
├── repositories/    # Acceso a datos
├── middleware/      # Middlewares de autenticación y validación
├── routes/          # Definición de rutas
├── schema/          # Validaciones con Zod
└── firebase/        # Configuración de Firebase Storage
```

## Características

- **Autenticación JWT** con tokens de acceso
- **Gestión de usuarios** con roles (admin, inspector, ayudante)
- **Subida de archivos** a Firebase Storage
- **Validaciones robustas** con Zod
- **Base de datos PostgreSQL** con Knex.js
- **Documentación automática** con Swagger
- **Arquitectura modular** y escalable

## Prerrequisitos

- Node.js (v16 o superior)
- PostgreSQL
- Cuenta de Firebase (para Storage)
- npm o yarn

## Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/tuusuario/vinculacion-sismico-backend.git
cd vinculacion-sismico-backend
```

2. **Instala las dependencias:**
```bash
npm i
```

3. **Configura las variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vinculacion_sismico
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña

# JWT
JWT_ACCESS_SECRET=tu_jwt_secret_muy_seguro
JWT_REFRESH_SECRET=tu_refresh_secret_muy_seguro

# Firebase
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@sistema-vulnerabilidad-sismica.iam.gserviceaccount.com
FIREBASE_PROJECT_ID=sistema-vulnerabilidad-sismica

DOMAIN_URL_FIREBASE_STORAGE=https://storage.googleapis.com
STORAGE_BUCKET=sistema-vulnerabilidad-sismica.firebasestorage.app

# Servidor
PORT=3000
```

4. **Configura Firebase:**
- Coloca tu archivo de credenciales de Firebase en la carpeta raíz
- Actualiza la configuración en `lib/firebase/firebase.js`

5. **Configura la base de datos:**
- Crea la base de datos PostgreSQL
- Ejecuta las migraciones necesarias

## Ejecución

### Desarrollo (con auto-reload):
```bash
node --watch server.js
```

### Producción:
```bash
node server.js
```

El servidor se iniciará en `http://localhost:3000`

## Documentación API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:
```
http://localhost:3000/api-docs
```

## Endpoints Principales

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario

### Usuarios
- `GET /users/inspectors` - Obtener inspectores
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario
- `PATCH /users/:id/role` - Actualizar rol (Solo admins)

### Edificios
- `GET /buildings` - Listar edificios
- `POST /buildings` - Crear edificio
- `GET /buildings/:id` - Obtener edificio específico

### Catálogos
- `GET /catalogues` - Obtener catálogos del sistema

## Autenticación

El sistema utiliza JWT para autenticación. Para acceder a rutas protegidas:

1. Realiza login en `/auth/login`
2. Incluye el token en el header: `Authorization: Bearer <token>`

### Roles de Usuario
- **admin**: Acceso completo al sistema
- **inspector**: Puede crear y gestionar inspecciones
- **ayudante**: Acceso limitado de solo lectura

## 📁 Estructura de Archivos

```
├── server.js              # Punto de entrada
├── data/
│   ├── database.js         # Configuración de base de datos
│   └── databaseTables.js   # Definición de tablas
├── lib/
│   ├── controllers/        # Lógica de controladores
│   ├── services/          # Lógica de negocio
│   ├── repositories/      # Acceso a datos
│   ├── middleware/        # Middlewares
│   ├── routes/           # Definición de rutas
│   ├── schema/           # Validaciones Zod
│   └── firebase/         # Configuración Firebase
├── utils.js              # Utilidades generales
├── anomaly.js           # Códigos de error
└── README.md
```

## Flujo de Datos

1. **Request** → Router → Middleware → Controller
2. **Controller** → Service → Repository → Database
3. **Response** ← Controller ← Service ← Repository


## Dependencias Principales

- **Express.js** - Framework web
- **Knex.js** - Query builder para PostgreSQL
- **JWT** - Autenticación
- **Zod** - Validación de schemas
- **Multer** - Manejo de archivos
- **Firebase Admin** - Storage en la nube
- **Bcrypt** - Hashing de contraseñas
- **Swagger** - Documentación API

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
