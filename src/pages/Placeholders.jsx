import React from 'react';

const Placeholder = ({ name }) => (
  <div className="pt-32 px-6 min-h-screen text-center">
    <h1 className="text-4xl font-serif font-bold text-teal-900 mb-4">{name}</h1>
    <p className="text-gray-500">Coming soon in Step 4/5...</p>
  </div>
);

export const Login = () => <Placeholder name="Login" />;
export const Register = () => <Placeholder name="Register" />;
export const Booking = () => <Placeholder name="Booking" />;
export const Results = () => <Placeholder name="Results" />;
export const Assessment = () => <Placeholder name="Assessment" />;
