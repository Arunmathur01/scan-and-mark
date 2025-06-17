# ScanMark

ScanMark is a MERN (MongoDB, Express.js, React.js, Node.js) stack application designed to simplify attendance tracking for teachers and students. With ScanMark, teachers can easily create attendance sessions, specifying location radius preferences, which generate unique QR codes. Students can then scan these codes or use a provided URL to log in and mark their attendance. The application automatically fetches the student's location upon attendance submission, ensuring accuracy and security. 

## Features

- **Session Creation**: Teachers can create attendance sessions with specified location radius preferences.
- **Automatic Location Detection**: ScanMark automatically detects the teacher's location to generate accurate attendance sessions.
- **QR Code Generation**: Each attendance session generates a unique QR code for easy student access.
- **Flexible Access**: Students can either scan the QR code or use the provided URL to access the attendance session.
- **Secure Authentication**: ScanMark uses JWT for authentication, hashing and salting user passwords for security.
- **Email Verification**: Users are verified via OTP during registration to ensure valid email addresses.
- **Forgot Password Functionality**: Users can reset their passwords using OTPs sent to their registered email addresses.
- **Dashboard for Teachers and Students**: Teachers have a dashboard to manage sessions and view attendance details, while students can view their attendance records and session details.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Image Storage**: Cloudinary

## Installation

To run ScanMark locally, follow these steps:

1. Clone this repository.
2. Navigate to the `backend` directory and run `npm install` to install server dependencies.
3. Navigate to the `frontend` directory and run `npm install` to install client dependencies.
4. Set up a MongoDB database and configure the connection in `backend/config/db.js`.
5. Set up Cloudinary for image storage and configure the connection in `backend/config/cloudinary.js`.
6. In the `backend/config/keys.js` file, set up your JWT secret key.
7. Run `npm start` in both the `backend` and `frontend` directories to start the application.

## Usage

1. **Teacher**: 
   - Log in to your account as a teacher.
   - Navigate to the dashboard and create a new attendance session.
   - Specify the location radius and other session details.
   - Generate the QR code and share it with your students.
   - View attendance details and student submissions on the dashboard.

2. **Student**:
   - Log in to your account as a student.
   - Access the attendance session by scanning the QR code or using the provided URL.
   - Click your photo and enter your Roll.no.
   - Submit your attendance, which includes automatic location detection.
   - View your attendance records and session details on the dashboard.

## Deployment

The application is deployed and accessible at [ScanMark Deploy](https://scanmark-deploy.onrender.com).

