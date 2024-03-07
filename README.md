Dynamic Tour Website

Description
This is a dynamic tour website built using Pug for templating and Express.js for the backend. MongoDB is used as the database to store tour and user data. On the frontend, Vanilla JavaScript is used for dynamic interactions. The website allows users to browse available tours, book tours, manage bookings, and utilize map features powered by Mapbox to view tour start and endpoints.

Features
Browse available tours
Book tours
Manage bookings
Authentication: User login and logout functionality
Authorization: Restricted access to certain features based on user roles
Payment Integration: Stripe for secure payment checkouts
Map Integration: Mapbox for visualizing tour start and endpoints

Tech Stack
Backend:

Express.js
MongoDB
Frontend:

Vanilla JavaScript
Pug (for templating)
Setup
Clone the repository.
Install dependencies using npm install.
Set up environment variables:
MONGODB_URI: MongoDB connection URI
SECRET_KEY: Secret key for authentication
MAPBOX_API_TOKEN: Mapbox API token
STRIPE_SECRET_KEY: Stripe secret key
Run the server using npm start.
Usage
Browse available tours and select the desired tour.
Log in or sign up to book a tour.
Enter payment details and confirm booking.
View and manage bookings in the user dashboard.
