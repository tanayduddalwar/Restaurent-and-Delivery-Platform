# Restaurant and Delivery Platform API

Welcome to the **Restaurant and Delivery Platform API**! This platform allows restaurants to manage food categories, menu items, and orders. It also provides functionalities for users to place and track orders. The API documentation is available via Swagger, which helps you explore the platform's endpoints easily.

## Features

### For Users
- **Place Orders**: Users can place food orders, specifying food items, quantities, and delivery addresses.
- **Track Orders**: Users can track the status of their orders in real time.
- **Browse Menu**: View available food items categorized by type and restaurant.

### For Restaurants
- **Manage Menu**: Restaurants can add, update, and delete food items in their menu.
- **Manage Categories**: Restaurants can create, update, and delete food categories.
- **View Orders**: Restaurants can view all orders placed by users and update their statuses.

### For Admin
- **User Management**: Admins can manage user accounts and permissions.
- **Restaurant Management**: Admins can manage restaurant listings, approve or reject restaurants.
- **Analytics**: Admins can view order analytics and platform statistics.

## API Documentation (Swagger)

The API documentation is available at the following endpoint:

- [Swagger API Docs](https://restaurent-and-delivery-backend.onrender.com/swaagger/)

## Installation

To set up the **Restaurant and Delivery Platform API** locally, follow the instructions below:

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (or MongoDB Atlas for cloud hosting)
- Docker (Optional, for containerized deployment)

### Steps to Run Locally

1. Clone the repository:

    ```bash
    git clone https://github.com/tanayduddalwar/Restaurent-and-Delivery-Platform.git
    cd Restaurent-and-Delivery-Platform
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up your environment variables in a `.env` file:

    ```bash
    PORT=8000
    MONGO_URI=<Your MongoDB URI>
    JWT_SECRET=<Your JWT Secret>
    ```

4. Run the application:

    ```bash
    npm start
    ```

    The API will be running at `http://localhost:8000`.

5. Access the Swagger documentation at `http://localhost:8000/swaagger/` (locally) or use the live hosted version: `https://restaurent-and-delivery-backend.onrender.com/swaagger/`.

## Endpoints Overview

### User Routes
- **POST** `/api/user/register`: Register a new user
- **POST** `/api/user/login`: User login and JWT authentication

### Restaurant Routes
- **POST** `/api/restaurent/create`: Create a new restaurant
- **PUT** `/api/restaurent/update/:id`: Update restaurant details
- **GET** `/api/restaurent/:id`: Get restaurant details

### Category Routes
- **POST** `/api/category/create`: Create a new category
- **PUT** `/api/category/update/:id`: Update a category

### Food Routes
- **POST** `/api/food/create`: Create a new food item
- **PUT** `/api/food/update/:id`: Update food item details

### Order Routes
- **POST** `/api/order/create`: Place a new order
- **GET** `/api/order/:id`: Get order details
- **PUT** `/api/order/update/:id`: Update order status

## Running in Docker (Optional)

To run the app using Docker, follow these steps:

1. Build the Docker image:

    ```bash
    docker build -t restaurant-delivery-platform .
    ```

2. Run the Docker container:

    ```bash
    docker run -p 8000:8000 restaurant-delivery-platform
    ```

The application will be accessible at `http://localhost:8000`.

## Contributing

We welcome contributions to improve the **Restaurant and Delivery Platform**. To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a pull request.
