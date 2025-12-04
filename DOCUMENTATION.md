# Hardware Asset Management Tool (HAMT) - Frontend Documentation

## 1. Project Overview

This document provides a comprehensive overview of the Hardware Asset Management Tool (HAMT) frontend codebase. The application is a React-based single-page application (SPA) designed to manage hardware assets. It provides different functionalities based on user roles: User, Admin, and Super Admin.

-   **Users** can view and request items.
-   **Admins** can manage the inventory, approve/deny requests, and view reports.
-   **Super Admins** have all the capabilities of an Admin, plus the ability to manage users.

The application is built with React and Material-UI for the user interface. It interacts with a backend API to perform CRUD operations on assets and users.

## 2. Routing Flow

The application's routing is managed by `react-router-dom`. The main routing logic is defined in `src/App.js`.

| Path | Component | Role | Description |
| :--- | :--- | :--- | :--- |
| `/` | `<Navigate to="/login" />` | All | Redirects the root path to the login page. |
| `/login` | `Login` | All | The main login page for all users. |
| `/forgotpassword` | `ForgotPassword` | All | Allows users to reset their password. |
| `/adashboard` | `Dashboard2` | ADMIN | The dashboard for Admin users. |
| `/sdashboard` | `SuperAdminDashboard` | SUPER_ADMIN | The dashboard for Super Admin users. |
| `/udashboard` | `UserDashboard` | USER | The dashboard for regular users. |

## 3. State Management

The application primarily uses React's built-in state management capabilities (`useState` and `useEffect` hooks) for component-level state. There is no global state management library like Redux or MobX being used.

-   **Data Fetching:** Data is fetched from the backend API using services defined in the `src/Service` directory. Components like `Dashboard2.jsx` and `UserDashboaard.jsx` fetch the initial data and pass it down to child components as props.
-   **State Propagation:** State is passed down from parent components to child components via props. For example, `Dashboard2` fetches the list of all items and passes it to `ItemTable` or `AdminCardDashboard`.
-   **State Updates:** When an action in a child component needs to update the state in a parent component (e.g., after adding or editing an item), callback functions are passed down as props. For example, the `onSuccess` prop is used to trigger a data refetch in the parent dashboard component.

## 4. Key Components

### 4.1. Login and Authentication

-   **`src/Component/Login/Login.jsx`**: This component provides the login form for users. It uses the `AuthService` to authenticate the user and, upon successful login, redirects them to the appropriate dashboard based on their role.
-   **`src/Component/Login/ForgotPassword.jsx`**: This component provides a form for users to reset their password. It uses the `ForgotPasswordServices` to handle the password reset logic.

### 4.2. Dashboards

-   **`src/Component/Admin/dashboard/Dashboard2.jsx`**: This is the main dashboard for Admin users. It serves as the central hub for all admin-related activities, including viewing, adding, editing, and managing items and requests. It contains filtering and search functionality and can display items in either a table view (`ItemTable`) or a card view (`AdminCardDashboard`).
-   **`src/Component/SuperAdmin/SuperAdminDashboard.jsx`**: This dashboard is for Super Admins. It inherits the functionality of the Admin dashboard and adds user management capabilities, such as adding new users (`AddUser.jsx`) and viewing all users (`UserTable.jsx`).
-   **`src/Component/User/UserDashboaard.jsx`**: This is the dashboard for regular users. It allows them to view available items and submit requests for them. It also supports both a table view (`ItemTableForUser`) and a card view (`ItemCardDashboard`).

### 4.3. Item Display Components

-   **`src/Components/ItemTable.jsx`**: A reusable component that displays a list of items in a table format. It is used in the Admin dashboard.
-   **`src/Component/User/ItemTableForUser.jsx`**: A similar table component tailored for the User dashboard, which includes functionality for selecting multiple items to request.
-   **`src/Component/Admin/dashboard/AdminCardDashboard.jsx`**: Displays items in a card layout for the Admin dashboard, providing a more visual representation of the inventory.
-   **`src/Component/User/ItemCardDashboard.jsx`**: A card-based view for the User dashboard, allowing users to select and request items.

### 4.4. History and Requests

-   **`src/Component/Admin/dashboard/HistoryCards.jsx`**: This component is used by Admins to view and manage pending item requests. It allows them to approve or deny requests.
-   **`src/Components/HistoryTable.jsx`**: Displays the history of requests for the current user.
-   **`src/Component/Admin/dashboard/RequestHistoryModel.jsx`**: A modal that shows a comprehensive history of all requests in the system, available to Admins.

## 5. Forms and Validation

### 5.1. Add Item Form

-   **Component**: `src/Component/Admin/dashboard/AddElement.jsx`
-   **Fields**: Asset Name, Category, Sub Category, Value, Manufacturer, Stock, Location, MPN, SAP NO, Package Box, Description, Is Returnable.
-   **Validation**: The form performs client-side validation to ensure that all mandatory fields are filled out before submission. The `validateForm` function checks for empty fields and displays error messages accordingly.

### 5.2. Edit Item Form

-   **Component**: `src/Component/Admin/dashboard/EditForm.jsx`
-   **Functionality**: This form is pre-filled with the data of the selected item and allows an Admin to update any of the item's properties. It also includes a "Delete" button to remove the item from the inventory.

### 5.3. Add User Form

-   **Component**: `src/Component/SuperAdmin/AddUser.jsx`
-   **Fields**: Name, Email, Password, Role.
-   **Functionality**: This form allows a Super Admin to create new users with a specified role.

### 5.4. Request Item Form

-   **Component**: `src/Component/Admin/dashboard/Available.jsx`
-   **Functionality**: This modal form is used to request a single item. It includes fields for quantity, project name, and remarks. It also includes validation to ensure the requested quantity does not exceed the available stock.

## 6. API Services

The application communicates with the backend through a set of services defined in the `src/Service` directory. The base URL for the API is configured in `src/Service/Config.jsx`.

-   **`src/Service/AuthService.js`**: Handles user authentication, including login and logout. It stores the user's session information (token, role, etc.) in `sessionStorage`.
-   **`src/Service/DashboardService.js`**: Contains functions for fetching all item data (`getAllData`), changing a user's password (`changePassword`), and checking for new requests (`fetchNewRequests`).
-   **`src/Service/AdminServices.js`**: Provides services for admin-specific actions, such as adding a new item (`addItem`).
-   **`src/Service/services.js`**: A general-purpose service file that includes functions for updating (`updateItem`), deleting (`deleteItem`), and requesting items (`requestItem`), as well as importing items from an Excel file (`importItems`).
-   **`src/Service/ForgotPasswordServices.js`**: Handles the API call for resetting a user's password.
-   **`src/Service/AuthHeader.js`**: A helper function that returns the authorization header with the user's JWT token, to be included in authenticated API requests.
