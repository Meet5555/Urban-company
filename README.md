# Urban Company - Job/Work Allocation Dashboard

The Urban Company Job/Work Allocation Dashboard is a web application designed to streamline job allocation and service requests. The platform caters to three main user roles: Normal Users, Service Providers, and Administrators.

## Table of Contents
- [Functionalities](#functionalities)
  - [Guest Users](#guest-users)
  - [Normal Users](#normal-users)
  - [Service Providers](#service-providers)
  - [Administrator](#administrator)
- [Data Schema](#data-schema)
- [Features and Interconnections](#features-and-interconnections)
- [Setup and Installation](#setup-and-installation)
- [Dependencies](#dependencies)

## Functionalities

### Guest Users
- **View Services:** Guests can browse available services without logging in.

### Normal Users
- **Sign Up/Log In:** Users can sign up or log in to access additional features.
- **User Dashboard:** After login, users have a dashboard displaying requested and active services.
- **Service Booking:** Users can request services, with a limit of three services at a time.
- **Service Management:** Users can delete requested services and cancel accepted services.
- **Search/Sort/filter:** User can search services based on name/desc/title and services can be filtered based on category and price range.

### Service Providers
- **Sign Up/Log In:** Service providers can sign up or log in.
- **Provider Dashboard:** Displays requested and active services based on the provider's category.
- **Service Acceptance:** Providers can accept up to three service requests at a time.
- **Service Completion:** Providers can mark services as completed.
- **Service Management:** Providers can delete accepted services.
- **Search/sort:** Providers can also perform search and sort on requested services.

### Administrator
- **Admin Dashboard:** Admin can view lists of all users and services.
- **CRUD Operations:** Admin can create, read, update, and delete users as well as services.
- **User Management:** Admin can edit user names.
- **Service Management:** Admin can edit service name, description, category, cost, etc.


## Data Schema

### Service
```json
{
  "name": "Light Fixture Replacement",
  "serviceId": 10,
  "category": "Electrician",
  "cost": "1000",
  "timeTaken": 2,
  "isConsumed": false,
  "description": "Replacement of light fixtures and fittings for improved lighting."
}
```

### Normal User
```json
{
  "id": 1,
  "name": "Meet",
  "password": "123",
  "isAdmin": false,
  "isServiceProvider": false,
  "requestedServices": [],
  "activeServices": [],
  "acceptedServices": []
}
```

### Service Provider
```json
{
  "id": 4,
  "name": "Meet P",
  "password": "123",
  "isAdmin": false,
  "isServiceProvider": true,
  "serviceProviderId": 2,
  "serviceProviderCategory": "Electrician",
  "acceptedServices": [],
  "requestedServices": [],
  "activeServices": []
}
```

### Requested Services array
```json
{
  "requestedBy": 1,
  "requestedService": 3 
}
```

## Features and Interconnections
- **User Authentication:** Sign up, log in, and role-based access.
- **Service Booking:** Users can request services, with a limit of three at a time.
- **Service Cancellation:** Users can delete requested services or cancel active services
- **Service Acceptance:** Providers can accept services up to a limit.
- **Dashboard Views:** Display of requested and active services for both users and providers.
- **CRUD Operations:** Admins can manage users and services.
- **Search, Sort, and Filtering:** Users and service lists can be searched, sorted, and filtered.
- **Service Completion:** Providers can mark services as completed.
- **Interconnections:** When user / services deleted or canceled then all the arrays gets updated properly.

## Setup and Installation
1. Clone the repository.
2. Open `index.html` in a web browser.

## Dependencies

This project uses the following framework and dependencies:

### `Bootstrap`
Bootstrap is a free and open-source CSS framework used for styling and responsiveness in the project.

- To learn more about Bootstrap or include it in your project, visit the [official Bootstrap website](https://getbootstrap.com/).

### `Toastify.js`
Toastify.js is a simple, flexible, and customizable toast notification library used for displaying user-friendly notifications in the project.

- For more information or to use Toastify.js in your project, refer to the [Toastify.js GitHub repository](https://github.com/apvarun/toastify-js).

### `Google Fonts`
Google Fonts provides a vast collection of free, open-source fonts used for enhancing the typography in the project.

- Explore and use Google Fonts by visiting the [Google Fonts website](https://fonts.google.com/).
