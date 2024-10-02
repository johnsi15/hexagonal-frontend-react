# Arquitectura Hexagonal con React + TypeScript

Hexagonal Architecture (también conocido como Ports-and-Adapters). 

La Arquitectura Hexagonal, también conocida como arquitectura de puertos y adaptadores, es un patrón de diseño que separa la lógica de negocio de una aplicación de sus interfaces externas. 

Utiliza "puertos" para definir la comunicación entre la lógica del negocio y los "adaptadores" que manejan las interacciones con el mundo exterior (como bases de datos, APIs o interfaces de usuario). Esto facilita la prueba, el mantenimiento y la escalabilidad de la aplicación.

La Arquitectura Hexagonal generalmente se organiza en tres capas principales:

1. Capa de Dominio:

   * Contiene la lógica de negocio central de la aplicación, incluyendo entidades, reglas de negocio y servicios.
   * Es independiente de cualquier tecnología o interfaz.

2. Capa de Aplicación:

   * Maneja la lógica de aplicación y las interacciones entre la capa de dominio y las interfaces externas.
   * Coordina las operaciones, orquesta los casos de uso y puede incluir validaciones y autorizaciones.

3. Capa de Infraestructura (Adapters):

  * Consiste en los adaptadores que permiten la comunicación con sistemas externos, como bases de datos, APIs, servicios de terceros, o interfaces de usuario.

  * Implementa los puertos definidos en la capa de dominio y proporciona las herramientas necesarias para la interacción.

Más información en el siguiente [post](https://blog.codium.team/2023-08_arquitectura-hexagonal-frontend-mis-problemas) aplicado al frontend con React.

## Ventajas de la Arquitectura Hexagonal en React

1. Desacoplamiento:

   * Ventaja: La arquitectura hexagonal se basa en la idea de desacoplar el dominio de la aplicación de la infraestructura. En React, esto significa que tu lógica de negocio no depende directamente de cómo se implementan detalles como llamadas a la API, almacenamiento, o incluso el framework de UI. Puedes intercambiar tecnologías (como cambiar de Axios a Fetch) sin tocar la lógica de negocio.
   * Comparación: En una arquitectura en capas tradicional, las capas suelen estar más acopladas, lo que puede hacer más difícil realizar cambios en la infraestructura sin que afecten otras partes del sistema.
2. Testabilidad:

   * Ventaja: Al estar desacoplado de los detalles técnicos, puedes probar la lógica de negocio de tu aplicación React sin tener que depender de bases de datos, APIs externas o el entorno del navegador. Esto simplifica las pruebas unitarias y de integración.
   * Comparación: En una arquitectura monolítica o tradicional, es más común que las pruebas dependan de la infraestructura subyacente, lo que dificulta la creación de tests aislados y rápidos.

3. Simplicidad en la evolución:

   * Ventaja: La arquitectura hexagonal facilita la extensión y evolución del sistema. Si tienes que cambiar una parte del sistema, como añadir una nueva fuente de datos (por ejemplo, pasar de una API REST a GraphQL), solo necesitas añadir un nuevo adaptador.
   * Comparación: En una arquitectura monolítica, el código tiende a crecer en complejidad a medida que se añaden nuevas funcionalidades, lo que puede hacer más difícil la extensión sin generar deuda técnica.

4. Claridad en responsabilidades:

   * Ventaja: La arquitectura hexagonal hace que las responsabilidades de cada componente o módulo sean claras: los adaptadores manejan la interacción con el "mundo exterior" (APIs, bases de datos, etc.), mientras que la lógica de negocio se mantiene en el "núcleo" de la aplicación.
   * Comparación: En una arquitectura monolítica, estas responsabilidades suelen estar mezcladas, lo que puede hacer más difícil entender y mantener el código a largo plazo.

## Desventajas de la Arquitectura Hexagonal en React:

1. Complejidad inicial:

   * Desventaja: Implementar una arquitectura hexagonal desde el principio puede agregar complejidad innecesaria en aplicaciones pequeñas o medianas. Implica crear adaptadores, puertos e interfaces adicionales, lo que puede parecer un sobreesfuerzo si el proyecto no tiene requisitos complejos.
   * Comparación: Una arquitectura en capas tradicional o monolítica puede ser más simple de implementar en aplicaciones más pequeñas o prototipos rápidos.
2. Curva de aprendizaje:

   * Desventaja: La arquitectura hexagonal es un patrón menos común en el desarrollo frontend, por lo que puede requerir una curva de aprendizaje para los desarrolladores acostumbrados a arquitecturas más tradicionales. También puede requerir más experiencia para implementarla correctamente.
   * Comparación: La arquitectura en capas tradicional es más intuitiva para muchos desarrolladores, especialmente en el mundo de React, donde la mayoría de las aplicaciones no separan completamente las responsabilidades de manera tan estricta.
3. Aumento del código ceremonial:

   * Desventaja: La necesidad de crear interfaces, adaptadores y clases adicionales para cumplir con los principios de la arquitectura hexagonal puede llevar a un aumento en el "código ceremonial" o "boilerplate". Este código no aporta valor inmediato en términos de funcionalidad, pero es necesario para mantener la arquitectura.
   * Comparación: En una arquitectura monolítica o en capas, no necesitas este código extra porque las capas están más acopladas y la infraestructura y la lógica de negocio están más entrelazadas.
4. Difícil de justificar en proyectos pequeños:

   * Desventaja: Para proyectos pequeños o de corta duración, la arquitectura hexagonal puede parecer innecesaria. El esfuerzo de mantener una separación estricta entre el dominio y la infraestructura puede no ofrecer beneficios tangibles en proyectos con pocos cambios o una vida útil corta.
   * Comparación: La arquitectura en capas tradicional es mucho más rápida de implementar y suficiente para la mayoría de las aplicaciones simples o de corto plazo.


## Aplicando arquitectura hexagonal

Primera versión con algunos problemas que se le puede llegar a llamar "sobre-ingeniería".

```ts
// domain
export type User = {
  name: string
  email: string
  age: number
}

export interface UserRepository {
  getUsers(): Promise<User[]>
}


// application
import { type User, UserRepository } from '../domain/User'

export type ProductDTO = {
  name: string
  email: string
  age: number
}

class ListUsers {
  constructor(private userRepository: UserRepository) {}

  async getUsers(): Promise<ProductDTO[]> {
    const users = await this.userRepository.getUsers()
    return users.map(product => this.convertToUserDTO(product))
  }

  private convertToUserDTO(user: User): ProductDTO {
    return {
      name: user.name,
      email: user.email,
      age: user.age,
    }
  }
}

export default ListUsers

// Infrastructure - Adapters
import axios from 'axios'
import { type User, UserRepository } from '../domain/User'

class HttpUserRepository implements UserRepository {
  constructor(private readonly apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl
  }

  async getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>(`${this.apiBaseUrl}/users`)
    return response.data
  }
}

export default HttpUserRepository

// UI
function App() {
  const [users, setUsers] = useState<ProductDTO[]>([])

  useEffect(() => {
    const userRepository = new HttpUserRepository('https://api.codium.team')
    const listUsers = new ListUsers(userRepository)

    listUsers.getUsers().then(setUsers)
  }, [])

  return (
    <main>
      <h1>Lista de usuarios</h1>
      <ul>
        {users.map((user, index) => (
          <li key={user.name} data-testid={'user-id-' + index}>
            <div>
              <h3>{user.name}</h3>
              <p>Email: ${user.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
```

## Testing

Aplicando hexagonal junto al patrón repositorio nos permite crear tests unitarios que cumplan con el acrónimo FIRST:

* Fast: sea rápido de ejecutar así obtenemos feedback rápido
* Isolate: que esté aislado, no dependa de base de datos ni de que tenga internet
* Repeatable: que siempre dé el mismo resultado.
* Self-validating: los tests se autovaliden sin tener que analizar si ha pasado o no
* Timely: los tests se deben crear antes de empezar a desarrollar el código (TDD).

# React + TypeScript + Vite

Esta plantilla proporciona una configuración mínima para hacer que React funcione en Vite con HMR y algunas reglas de ESLint.

Actualmente, hay dos complementos oficiales disponibles:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Ampliando la configuración de ESLint

Si estás desarrollando una aplicación para producción, te recomendamos actualizar la configuración para habilitar reglas de linting que tengan en cuenta el tipo:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```