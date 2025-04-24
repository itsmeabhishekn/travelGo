# TravelGo - Travel Package Booking Application
![TravelGo Screenshot](https://i.imgur.com/djBmmwh.jpg)


## Overview 

TravelGo is your one-stop solution for booking customized travel packages. Whether you're an admin managing tours or a traveler looking for your next adventure.

### Key Highlights 
- **Dual Role System**: Separate interfaces for admins and travelers
- **Smart Analytics**: Business insights through real-time data visualization
- **Secure Authentication**: JWT + Google OAuth with role-based access
- **Cloud-Powered**: Hosted on AWS with Dockerized deployment
- **Responsive Design**: Fully optimized for all devices

## Tech Stack 

| Category       | Technologies Used                          |
|----------------|-------------------------------------------|
| **Frontend**   | React.js, Tailwind CSS, Chart.js          |
| **Backend**    | Node.js, Express.js                       |
| **Database**   | MongoDB                                   |
| **Auth**       | JWT, Google OAuth 2.0                     |
| **Infra**      | AWS EC2, S3, Route 53                     |
| **DevOps**     | Docker, PM2, Nginx                        |

## Features 

### Admin 
- **Secure Dashboard**
  - Admin routes secured with JWT
  - Session management
- **Package Management**
  - CRUD operations for travel packages
- Determine settings, prices, dates, and services
- **Business Intelligence**
  - Interactive graphs (Chart.js)
  - Booking trends inspection
  - Tracking package statuses:
    -  Successfully completed trips
    -  Live Trips
    -  Pending journeys

###  Traveler 
- **Auth**
  - Email/password (bcrypt hashed)
  - 1-click Google auth
  - JWT session handling
- **Smart Search**
  - Filter by dates/location
  - Sorting based on price
- **Custom Packages**
  - Add/remove services
  - Real-time price calculator
  - Instant booking confirmation
- **Personal Space**
  - Editable profile using S3 for image storage
  - Well-organized booking history:
    -  Upcoming trips
    -  Active trips
    -  Past trips

## Advanced features

### Cloud Architecture 
- **EC2 Hosting**: Elastic AWS infrastructure
- **S3 Storage**: Secure profile images
- **Route 53**: Custom domain routing (streakwars.win)

### Security 
- Role-based access control
- Encrypted JWT tokens
- API endpoints protected
- bcrypt password hashing

---------------------------------------------------------------------------------------

# Setup Instructions

## 1. Clone the Repository
```
git clone https://github.com/your-username/travelgo.git
cd travelgo
```
2. Install Dependencies
Backend
--------
```
cd server
npm install
```
Frontend
-----------
```
cd client
npm install
```
3. Environment Variables
----------------------

Create a .env file in the server directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/travelGO
PORT=5000
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name
CLIENT_URL=http://localhost:5173
```

4. Start the Application
-------------------------
Backend
---------

```
cd server
npm run dev
```
Frontend
----------
```
cd client
npm run dev
```
