Website 
1)Starting Frontend:
=>npm start
-In a React project, npm start is a command used to start the development server.Add the path by mentioning cd "Pathname"c
-Runs the app in the development mode.
-Open http://localhost:3000 to view it in your browser.
-The page will reload when you make changes.
-You may also see any lint errors in the console.

=>npm test
-Launches the test runner in the interactive watch mode.
-See the section about running tests for more information.

=>npm run build
-Builds the app for production to the build folder.
-It correctly bundles React in production mode and optimizes the build for the best performance.
-The build is minified and the filenames include the hashes.
-Your app is ready to be deployed!

2)Starting Backend:
=>& 'C:\Program Files (x86)\Java\jdk1.8.0_202\bin\java.exe' '-cp' 'C:\Users\DHARNE~1\AppData\Local\Temp\cp_2sdwhxh431dlo0jsi0b8j0fju.jar' 'com.example.demo.DemoApplication'  is used to run backend

=>'C:\Program Files (x86)\Java\jdk1.8.0_202\bin\java.exe': This is the path to the Java executable (java.exe) on your system. It specifies the location of the Java runtime environment (JRE) or Java Development Kit (JDK) that will be used to execute the Java program.

=>'-cp': This stands for the classpath. It is followed by the classpath entries required for the Java application to run.

=>'C:\Users\DHARNE~1\AppData\Local\Temp\cp_2sdwhxh431dlo0jsi0b8j0fju.jar': This is the path to a JAR (Java Archive) file. JAR files are used to package Java applications and their dependencies. In this case, it seems to be a temporary JAR file located in the specified directory.

=>'com.example.demo.DemoApplication': This is the fully qualified name of the main class of the Java application. The specified class (DemoApplication) likely contains the main method, which serves as the entry point for the application.

Frontend(React) 
3)Higher Order Component:
-In React, a higher-order component (HOC) is a function that takes a component as an argument and returns a new component that wraps the original component. This allows you to reuse component logic across multiple components without having to re-write the same code in each one. 
-The withLogoutHandler function is a Higher-Order Component. It takes a component as an argument and returns a new component that wraps the original component.This new component inherits all the functionality of the original component, but it also gains additional functionality for handling logout events.
-I implemented a Higher Order Component (HOC) named withLogoutHandler. Let me break down the key components and explain how this HOC works:

=>Purpose of the HOC:
-The purpose of the withLogoutHandler HOC is to enhance a given component by adding a logout functionality. This enhancement involves handling logout-related logic when a logout message is received through a broadcast channel.

=>Usage of the HOC in code:
-The withLogoutHandler HOC to wrap components like homepage.
 
=>Functionality of the HOC:
-The HOC itself is a function that takes a component (WrappedComponent) as an argument and returns a new component that includes additional behavior. In this case, the additional behavior is handling logout functionality.

=>Logout Handling Logic:
-Inside the useEffect hook of the HOC, you have the logic for handling logout. When a logout message is received through the logoutChannel, the handleLogout function is called. This function navigates to the "/start" route, clears the localStorage, reloads the page, and displays a snackbar message indicating a successful logout.

=>Applying the HOC:
-Finally, the enhanced WrappedComponent is rendered with the original props passed down to it.

4)Component Lifecycle:
=>definition:
-In React, the component lifecycle refers to the series of phases a React component goes through from its creation to its removal from the DOM.

=>Initialization Phase:
-useState: Initializes state variables (type, data, value, currentPage).

=>Mounting Phase:
-useEffect (1st): Fetches data from the API when the component is mounted 

=>Rendering Phase:
-The component renders JSX based on the state (type, value, currentPage) and data obtained from the API (data, uniqueItems, filteredItems, currentItems).

=>Updating Phase:
-useState (re-renders component when state changes): Handles state changes, such as updating the search value (value) and pagination (currentPage).
useEffect (2nd): Handles data fetching, updates (componentDidUpdate equivalent).

=>Event Handling:
-Functions like handletomenex, handletologin, handletoregister are called in response to user actions, updating state and triggering re-renders. 

5)State Splitting in react:
-State splitting in React refers to the practice of dividing a large component's state into smaller, more manageable pieces. This approach helps to improve the maintainability and scalability of React applications by making it easier to track, reason about, and update the state of complex components. 

=>state splitting in Start: 
->The Start component fetches data from an API and stores it in its state.
->The Start component then filters the data based on the user's input.
->The Start component passes the filtered data to the CustomCard component.
->The CustomCard component only renders the data that it needs to display. 


6)React Router:
=> React Router is a library for managing navigation between pages in a  application. It provides a declarative way to define routes, switch between them, and manage the history stack

=><MemoryRouter>
 The <MemoryRouter> component in React Router is a type of router that keeps its routing history entirely in memory, without affecting the browser's address bar. This makes it particularly useful in several scenarios:

=><Router>
The <Router> component is the core element of React Router, a popular library for managing navigation within your single-page application (SPA). It provides various functionalities to handle URL changes, render different components based on the current route, and maintain navigation history.
=>Purpose:
-Manages routing logic and renders the appropriate components based on the current URL.
-Provides navigation capabilities using components like <Switch> and <Route>.

=><Routes>
 The <Routes> component plays a crucial role in defining the overall routing structure of your application. It works seamlessly with the <Route> component to map specific URL paths to the corresponding components you want to render. Here's a breakdown of how it works:
=>Purpose:
-Acts as a container for multiple <Route> components.
-Defines the hierarchical organization of your routes.
-Enables nested routing, allowing you to group related routes under a parent path.

7)Props:
-shortform for properties allow users to pass arguments or data from one component to another component. They are read only and  and can't be changed by children component. They are passed form parent to child component
-This parameter in the HOC function receives all the props passed to the wrapped component . These props are then spread further down to the wrapped component within the function body.

=>Using props:
-The enhanced component is created by invoking the WrappedComponent with the spread operator {...props}. This means that all the original props passed to the enhanced component will be forwarded to the WrappedComponent. This is a common pattern in HOCs to ensure that the enhanced component retains its original props.

=>In Address Page:
-In the context of specific code, the Address component is wrapped with the withLogoutHandler HOC, and any props passed to Address will be forwarded to WrappedComponent (which is Address in this case).
-So, any props that were initially intended for the Address component can be accessed and used within the Address component as usual. The props variable inside Address will contain the original props as well as any additional props or behavior added by the withLogoutHandler HOC.

8)State:
-State in React refers to the dynamic data that can change over time, affecting the rendering of your components. It allows you to create interactive and responsive interfaces based on user actions, API responses, or any other dynamic change in your application.

=>Here's a breakdown of state in React:
-State Variable: Holds the actual data value that represents the current state of a component.
-State Management: Techniques for manipulating and accessing state within your components and across your application.
-State Update: Triggered by event handlers, API calls, or other interactions that change the state value.
-Re-rendering: When state changes, React re-renders the affected components using the updated state, reflecting the change in the UI.

States in start page:
->data: This state variable holds the data fetched from the API and is used to populate the list of products.
->value: This state variable holds the current value of the search input.
->currentPage: This state variable keeps track of the current page for pagination.
->suggestionsList: This state variable holds the list of suggestions for the search input.

9)React Testing:
=>Unit testing
-A unit test is a test that isolates a single unit of code, such as a function, class, or module, and tests its behavior. 

=>integration testing
-An integration test is a used to test how two or more units of code interact with each other. Integration tests can be more complex than unit tests, but they are essential for ensuring that the different parts of an application work together correctly.  

=>End-to-end Testing:
-End-to-end testing is not done for the user to understand the page. End-to-end testing is done to ensure that the entire application is working correctly from the user's perspective. The tests should simulate how a user would interact with the application, from start to finish.

10)useState:
-useState is preferred in modern React development for several reasons:
=>Simplicity and Readability:
-The syntax of useState is more concise and readable compared to the traditional class component state syntax.
-It makes functional components more straightforward and eliminates the need for boilerplate code associated with class components.

=>Separation of Concerns:
-Hooks, including useState, promote a more modular and reusable code structure.
-Stateful logic can be extracted into custom hooks, allowing components to focus on rendering and presentation while delegating logic to hooks.

=>Easier to Understand Lifecycle:
-Hooks, including useState, make it easier to understand the lifecycle of a component. Each call to a hook is a self-contained unit of logic.
-In contrast, class components have various lifecycle methods (e.g., componentDidMount, componentDidUpdate), which can make it more challenging to follow the flow of logic.

=>Functional Programming Paradigm:
-Hooks fit well with the functional programming paradigm, where functions are pure and state is managed immutably.
-useState promotes immutability by providing a function to update state based on the previous state.

=>Consistency Across Components:
-With the introduction of hooks, functional components can now use the same state management mechanism (useState) as class components.
-This consistency makes it easier for developers to switch between functional and class components or work on projects with a mix of both.

=>Better Performance:
-React can optimize the rendering of functional components that use hooks, potentially leading to better performance.
-Hooks allow React to memoize state and avoid unnecessary renders.

=>Hooks API for Side Effects:
-Hooks like useEffect can handle side effects in a declarative and centralized way, making it easier to manage asynchronous operations and subscriptions.
-Class components required lifecycle methods to handle side effects, leading to scattered and harder-to-follow logic.
-While useState is widely preferred, it's important to note that the choice of using hooks or class components depends on the project and team preferences. 
-Newer projects often use hooks for their advantages, while existing projects may still use class components due to legacy code or specific requirements.

11) React Testing:
In Start Page:
=>Test: should filter products based on search term
-This test checks if exactly one product card is rendered when the user types "formal" in the search bar on the provided application. Here's a breakdown of the steps:

=>Test: suggestion list appears when text is typed without any error
-The test also renders the Start component within a MemoryRouter.
-It finds the input with the placeholder text 'Search Products' and triggers a change event by typing 'Formal' into the input.
-It then checks for the presence of an element with the test ID 'search-container', expecting it to print suggestions.

=>Test: renders the custom cards
-This test renders the Start component within a MemoryRouter.
-It retrieves all elements with the test ID 'custom-card' and checks that the number of such elements is greater than 0, indicating that custom cards are being rendered.

=>Test: should render with pagination and handle page clicks
-The test renders the Start component within a MemoryRouter.
-It then checks that the number of custom cards rendered is less than or equal to 15.
-It uses the waitFor function to wait for an asynchronous operation, and within that callback, it asserts the presence of a pagination button with the test ID 'pagination-button'.

=>Memory Router 
-This ensures that when the Start component interacts with React Router components (like Link or useNavigate), it does so in a way that is isolated to the test environment.
-If  component includes navigation or routing logic, using MemoryRouter in your test allows you to simulate navigation and test how your component responds without affecting the global browser history.
-MemoryRouter is used in testing to provide a controlled environment for testing components that use React Router. It's a useful tool for isolating your tests and making them more reliable.
-MemoryRouter allows you to test your React routing components in isolation, independent of any external browser interactions. This makes tests more predictable and reliable, as you can control the route changes and history independent of the actual browser window

12)getByTestId
-getByTestId is a query function in React Testing Library (RTL) used to access specific elements in your UI based on a custom data-testid attribute. It's useful in scenarios where matching by text or accessibility roles isn't feasible.

Here's a breakdown of getByTestId:
=>Function:
-Accepts a single string argument, the testid you assigned to the element.

=>Purpose:
-Helps you find elements without relying on visible text or accessibility semantics.

13)getByText
-getByText is another helpful query function in React Testing Library (RTL) used to find elements based on their text content. It's a common and preferred choice for testing UI interactions related to visible text on the screen.

Here's a breakdown of getByText:
=>Function:
Accepts a single string argument, the specific text you want to match in the element's content.

14)getByPlaceholderText:
-In React testing using libraries like Jest and Testing Library, getByPlaceholderText is a function provided by Testing Library to select elements in the DOM by their placeholder text. This is commonly used for testing form elements. Below is an example of how you might use getByPlaceholderText in a React test:

15)What is the Context API?

-It's a mechanism for sharing data between components in a React application without having to pass props through multiple levels of the component tree.
-It's useful for managing global state or data that needs to be accessible to many components throughout the app.

=>Key Concepts:
-Provider: A component that creates a context and makes its value available to its children.(loginContext)
-Consumer: A component that can access the context value from any level of the tree, even if it's not a direct descendant of the provider.(Components like 
homepage,loginpage)

Here's a breakdown of  Context API in code :
=>In LoginContext.js
-I created a context named LoginContext using createContext().
-Also define a custom hook useLoginContext to conveniently access the context values in your components.

=>App.js
-Wrap the main part of your application with LoginContext.Provider.
-The value prop provides the values that will be available to all components wrapped inside this provider.
-These values include Balance, setBalance, showModal, setShowModal, jwt, and setjwt.

=>HomePage.js
-In component,I used the useLoginContext hook to access the context values.
-You can destructure the values you need, such as jwt and setjwt, directly from the context.
-This allows you to use these values within the component.

=>Explanation:
-The Context API is used to create a global context (LoginContext) to manage login-related state across your application.
-The LoginContext.Provider in App.js wraps application, making the context values available to all components within the Router component.
-Components like HomePage.js use the useLoginContext hook to consume the context values, providing a clean and efficient way to access and update the login-related state across different parts of your application.

16)Lazy Loading
-Lazy loading in React is a technique used to improve the performance of web applications by loading only the necessary components or resources when they are actually needed, rather than loading everything upfront. This helps in reducing the initial bundle size and speeds up the initial page load time. 

1. Importing Components Lazily
2. Rendering Components with Suspense
3. Code Splitting and Loading on Demand

-This approach splits the code into multiple bundles.
-Only the bundle for the initial page is loaded upfront, reducing initial load time.
-Other components are loaded only when their routes are accessed, improving performance and perceived loading speed.

=>Advanages:
-Faster Initial Page Load
-Improved Time-to-Interactive
-Reduced Memory Usage
-Efficient Resource Utilization
-Better User Experience
-Optimized Caching

Here's a breakdown of  lazy loading in App.js:
=>Import lazy function
=>Wrap components with lazy
=>Wrap  routes with Suspense:
-The Suspense component is used to wrap the part of your application where lazy-loaded components are used. The fallback prop is what will be displayed while the lazy-loaded components are being loaded.
=>Using lazy-loaded components in Routes:
-In the element prop of the Route components, you are using the lazy-loaded components. These components will be loaded asynchronously when the corresponding routes are accessed.
-By using lazy loading, you optimize the loading time of your application by only fetching the code for the components that are actually needed at runtime. This can lead to faster initial page loads and a better user experience.

17)UseEffect:
-In React, the useEffect hook is a powerful and commonly used hook for handling side effects in functional components. It allows you to perform side effects in your components, such as fetching data, interacting with the DOM, or subscribing to external events. The useEffect hook takes two arguments: a function that contains the code to execute, and an optional array of dependencies that determines when the effect should run.

key aspects of the useEffect hook:
=>Effect Function:
-The first argument to useEffect is a function that contains the code you want to run as a side effect.
-This function will be executed after the component renders.

=>Dependencies Array:
-The second argument is an optional array of dependencies.
-If provided, the effect will only run if any of the dependencies have changed since the last render.
-If the dependencies array is omitted, the effect runs after every render.

=>Cleanup Function:
-The function returned from the effect function is a cleanup function.
-This function is called when the component is unmounted or when the dependencies change before the next render.
-It is used to perform cleanup tasks like unsubscribing from subscriptions or canceling network requests.

In Start page code:
=>useEffect Hook:
-The useEffect hook is a React hook that allows you to perform side effects in functional components. It runs after the component has been rendered.

=>Act Function:
-The act function is used to wrap code that causes side effects in React components. It ensures that all state updates triggered by the wrapped code are flushed before the component is considered "done" with its side effects.

=>Data Fetching:
-The fetch function is used to make an HTTP request to the URL 'http://localhost:8080/api/combodata'.
-The response is checked for success (response.ok). If the response is not okay, an error is thrown.
-If the response is okay, the JSON data is extracted using response.json().

=>Setting State:
-The fetched data is then used to update the component's state using the setData function. This assumes that there is a state variable named data and a corresponding setData function.

=>Error Handling:
-If there are any errors during the fetch or parsing of the response, an error message is logged to the console.

=>Empty Dependency Array:
-The empty dependency array ([]) indicates that this effect does not depend on any specific values from the component's props or state. Therefore, the effect runs only once when the component mounts.

18)Enquesnackbar:
-EnqueueSnackbar is typically associated with the SnackbarProvider component from the notistack library. The notistack library is commonly used in React applications to display snackbars or toasts for notifications.

19)Cookies:
-Cookies are being used to store and manage user-related information during the processing of the webpage:

20)Classname:
-In React, the className attribute is used to specify the CSS class for a DOM element. It is analogous to the class attribute in HTML. You use it to apply styles to React components.

21)window.location.reload():
-In React, you can use window.location.reload() to reload the current page.  

22)ReactPlayer:
-ReactPlayer component is imported from the react-player library. This library provides a React component for playing various types of media, such as videos and audio. The ReactPlayer component is a versatile player that supports a variety of media sources and formats. 

23)Google Signin:
-GoogleSignInButton component uses the LoginSocialGoogle component from the reactjs-social-login library to provide a Google Sign-In button. The Google Sign-In process involves a series of steps to authenticate a user with their Google account. Below is an explanation of how your Google Sign-In component works:

=>Rendering the Google Sign-In Button:
-The component renders a GoogleLoginButton provided by the react-social-login-buttons library. This is the button that users will click to initiate the Google Sign-In process.

=>Setting Up Google Sign-In with LoginSocialGoogle:
-The LoginSocialGoogle component is used to set up the Google Sign-In process.
-It takes various props like client_id, scope, discoveryDocs, and access_type to configure the Google Sign-In parameters.
The onResolve and onReject callbacks are provided to handle the response when the user resolves or rejects the Google Sign-In prompt.

=>Handling the Google Sign-In Resolution:
-When the user successfully signs in with Google, the onResolve callback is triggered.
-The onResolve callback receives the provider (which is 'google' in this case) and the user data containing information like the user's given name, email, etc.
The user data is then passed to the handleLogin function.

=>Handling the Google Sign-In Rejection:
-If the user rejects the Google Sign-In prompt, the onReject callback is triggered. The rejection reason (error) is logged to the console.

=>Making a Backend Request to Authenticate with Google Token:
-The handleLogin function makes a backend request to 'http://localhost:8080/api/register/google' to authenticate the user with the Google-provided information.
-The user data is sent in the request body, and the server responds with a token if the authentication is successful.

=>Handling Backend Response:
-If the backend response is successful (HTTP status 200), the received token is stored in a cookie using Cookies.set.
-The token is also set in the React state using the setjwt function from the LoginContext.
-The user's ID is extracted from the token using the parseJwt function and stored in a cookie as well.
-Finally, the user is redirected to the homepage of the application.

=>Handling Errors:
-If there is an error during the Google Sign-In process or the backend authentication, error messages are logged to the console, and a snackbar notification is displayed to the user.

Backend(Java Spring Boot)
24)Spring Framework:
=>@RestController:
-Marks the class as a Spring MVC controller, which is capable of handling web requests.
=>@RequestMapping: 
-Defines the base URI for the controller ("/api").
=>@CrossOrigin: 
-Configures cross-origin resource sharing (CORS) for the specified origins.

25)Spring JDBC:
=>JdbcTemplate: 
-A Spring class that simplifies JDBC operations. It is used for executing SQL queries and retrieving results from the database.

26)CORS (Cross-Origin Resource Sharing):
=>@CrossOrigin(origins = "http://localhost:3000"): 
-Enables cross-origin resource sharing for the specified origin. This annotation allows requests from "http://localhost:3000."

27)Value Injection:
=>@Value("${jwt.secret-key}"): 
-Reads the value of the "jwt.secret-key" property from the application properties file. This value is used for generating JWT tokens.

28)HTTP Methods and Request Mapping:
=>@PostMapping:
-In Spring MVC, the @PostMapping annotation is a specialized form of the more general @RequestMapping annotation. It is used to map HTTP POST requests to specific handler methods in a controller. The @PostMapping annotation is a shortcut that combines the @RequestMapping annotation with the method attribute set to RequestMethod.POST.

=>Example:@PostMapping("/buyer"), @PostMapping("/seller"), @PostMapping("/company"): 
-Handle POST requests for buyer, seller, and company logins, respectively in LoginController. These methods use the JdbcTemplate to query the database and generate JWT tokens.

=>@GetMapping:
-In Spring MVC, the @GetMapping annotation is used to map HTTP GET requests to specific handler methods in a controller. It is a shortcut for the more general @RequestMapping annotation with the method attribute set to RequestMethod.GET. The @GetMapping annotation is commonly used when you want to handle HTTP GET requests and don't need to specify other attributes like path patterns or request parameters.

=>Example:@GetMapping("/address/{username}"): 
-Maps HTTP GET requests to "/api/address/{username}" for fetching a user's address.

29)ResponseEntity:
=>ResponseEntity<String>: 
Represents the entire HTTP response. It allows for fine-grained control over the response status, headers, and body. ResponseEntity is used to send HTTP responses with appropriate status codes and messages.

30)Exception Handling:
=>try-catch blocks: 
-The code includes error handling using try-catch blocks. If an exception occurs during database queries or token generation, appropriate error responses are returned.

31)JWT Token Generation:
=>JwtUtils.generateToken(): A utility class (JwtUtils) is used to generate JWT tokens. The generated token is sent in the response if the login is successful.

32)Logging:
=>System.out.println(): 
-Logging statements are used to print messages to the console for debugging purposes.

33)JavaMail API:
=>javax.mail: 
-Provides classes for sending and receiving email messages.
=>Properties: 
-Used to configure mail server properties.
=>Session: 
-Represents a mail session and is used to configure various properties.
=>Authenticator: 
-An abstract class that provides a callback method for obtaining a PasswordAuthentication instance.
=>Message: 
-Represents an email message.
=>Transport: 
-Sends a Message to the email server.

34)HTTP Responses:
=>ResponseEntity.ok(users): 
-Returns a response with a 200 OK status code and the retrieved list of users if it's not empty.
=>ResponseEntity.notFound().build(): 
-Returns a response with a 404 Not Found status code if the list of users is empty.
=>ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(): 
-Returns a response with a 500 Internal Server Error status code in case of an exception.

35)Annotations 
=>@Entity:
-Marks the class as a JPA entity, indicating that instances of this class can be persisted to a relational database.

=>@Table(name = "users"):
-Specifies the name of the database table to which this entity is mapped. In this case, the table name is "users."

=>@Id:
-Indicates that the corresponding attribute (id) is the primary key for the entity.

=>@GeneratedValue(strategy = GenerationType.IDENTITY):
-Specifies the strategy for generating primary key values. In this case, it uses the identity column feature of the database, typically used with auto-incrementing columns.

=>@Getter and @Setter:
-Lombok annotations that automatically generate getter and setter methods for the class attributes.

=>@RequiredArgsConstructor:
-Lombok annotation that generates a constructor with required fields as arguments. This is useful, for example, when initializing an object with non-null fields.

=>@Id and Database Fields:
-The class has attributes corresponding to database fields, such as username, password, email, address, balance, loyalty, and profilepic. These attributes represent the columns in the "users" table.

=>Lombok Annotations (Getter, Setter, and RequiredArgsConstructor):
-Lombok is used to reduce boilerplate code. The @Getter and @Setter annotations generate getter and setter methods for all fields. The @RequiredArgsConstructor generates a constructor with required fields as parameters.

=>Relationship Annotations (commented out):
-There is a commented-out @OneToMany annotation, suggesting a potential one-to-many relationship with another entity (possibly Combo). This relationship is not currently active but can be uncommented and configured accordingly.

36)Jwt:
-JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. It is commonly used for authentication and information exchange between parties in a web application. JWTs consist of three parts: a header, a payload, and a signature. These parts are concatenated with dots (.) to form a compact string.

Let's break down the provided JwtUtils class and understand how it creates JWT tokens:

=>SECRET_KEYS List:
-The class maintains a list of secret keys. These keys are used to sign the JWTs. For added security, multiple keys are generated and stored.

=>generateToken Method:
-Parameters: Takes user-specific information such as id, username, and type as input parameters.

=>Logic:
-It selects a secret key from the list based on the current time to add a level of randomness (SECRET_KEYS.get(keyIndex)).
-Uses the Jwts.builder() to create a JWT builder.
-Sets claims (id, username, type) in the payload using the claim method.
-Sets the issued-at time using setIssuedAt(new Date()).
-Signs the JWT using the selected secret key with the signWith method.
-Finally, compact the JWT using compact().

=>generateStrongSecretKey Method:
-Generates a strong secret key for signing the JWTs.
-Uses a SecureRandom to generate a random byte array of length 64 (512 bits).
-Encodes the byte array using Base64 URL encoding without padding.

=>Purpose:
-The purpose of this utility class is to provide a method for generating JWT tokens. The class uses a rotating set of secret keys for added security. The rotation of keys helps mitigate certain security risks associated with long-lived keys.

=>Note:
-The generateStrongSecretKey method is used to generate strong secret keys, and the generateToken method combines user-specific claims and a randomly selected secret key to create a signed JWT.
-When a user logs in or performs an action that requires authentication, the generateToken method is likely called to create a JWT. This JWT can then be sent to the client, stored on the client side, and used for subsequent authenticated requests to the server. The server can verify the authenticity of the JWT using the stored secret keys.

37)Mapping
-One-to-one, one-to-many, many-to-one, and many-to-many mappings are the four basic types of entity relationships in Java Spring Boot. These mappings are used to model the relationships between different entities in a database.  Entity relationships are used to model the relationships between different tables in a database, not just entities.

=>One-to-One Mapping:
-A one-to-one mapping is a type of relationship where each entity instance can be mapped to a single instance of another entity. This type of mapping is typically used to model relationships such as a user to a profile, or an order to a shipping address.

=>One-to-Many Mapping:
-A one-to-many mapping is a type of relationship where a single entity instance can be mapped to multiple instances of another entity. This type of mapping is typically used to model relationships such as a customer to their orders, or a product to its reviews.

=>Many-to-One Mapping
-A many-to-one mapping is the opposite of a one-to-many mapping. It is a type of relationship where multiple entity instances can be mapped to a single instance of another entity. This type of mapping is typically used to model relationships such as students to their courses, users to their roles or products to review. 

=>Many-to-Many Mapping
-A many-to-many mapping is a type of relationship where multiple entity instances can be mapped to multiple instances of another entity. This type of mapping is typically used to model relationships such as students to courses, or users to roles. 

38)Backend Testing:

Backend testing in a Java Spring Boot application involves verifying the correctness and reliability of the server-side logic, including controllers, services, repositories, and other components. Spring Boot provides excellent support for testing through various testing annotations and utilities. Here's an overview of backend testing in a Java Spring Boot application:

=>Unit Testing:
-Purpose: Tests individual components (methods, classes) in isolation.
-Tools: JUnit, TestNG, Mockito, Hamcrest.

=>Integration Testing:
-Purpose: Verifies interactions between different components and their integration within the Spring context.
-Tools: JUnit, TestNG, SpringBootTest, TestRestTemplate, MockMvc.

=>Repository Testing:
-Purpose: Tests data access and persistence logic in repositories.
-Tools: JUnit, TestNG, Spring Data, TestEntityManager.

=>Mocking:
-Purpose: Mock external dependencies or services to isolate the unit of code being tested.
-Tools: Mockito, @MockBean.

=>REST API Testing:
-Purpose: Tests the functionality of RESTful APIs.
-Tools: TestRestTemplate, MockMvc.

=>Annotations:
-@SpringBootTest: Indicates that the test should load the complete Spring application context. This annotation is commonly used for integration tests.
-@AutoConfigureMockMvc: Configures the MockMvc instance for use in testing the Spring MVC layer.
Test Method:

-@Test: Identifies this method as a test case.
Autowired Dependencies:

-@Autowired private MockMvc mockMvc: Injects a MockMvc instance, which is a Spring class for testing Spring MVC controllers without starting a full HTTP server.

-@Autowired private JdbcTemplate jdbcTemplate: Injects a JdbcTemplate instance, which is a Spring class for interacting with a relational database using JDBC.

=>Test Scenario 
-testBuyerLogin_ValidCredentials_Success:

=>Objective:
-This test case checks the behavior of the buyer login endpoint when valid credentials are provided.

=>SQL Query:
-Executes a SQL query to retrieve the username and password from the "users" table for a specific user ID (in this case, ID 2).
-The retrieved data is then used to construct a LoginRequest object.

=>MockMvc Request:
-Uses MockMvc to perform a POST request to the "/api/buyer" endpoint.
-The request body contains JSON representing a LoginRequest object with the username and password obtained from the database.

=>Expectations:
-Expects the HTTP status to be 200 (OK) using status().isOk().
-Expects the content type of response to be "text/plain;charset=UTF-8" using content().contentType(MediaType.parseMediaType("text/plain;charset=UTF-8")).