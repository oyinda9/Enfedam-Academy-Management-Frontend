import React from 'react';
import Image from 'next/image';
const LoginPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Image Section */}
      <div className="relative w-1/2">
      <Image
        src="/enfedam.jpg"
        alt="School"
        fill
        className="object-cover"
      />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Login Form Section */}
      <div className="flex items-center justify-center w-1/2 p-8 bg-blue-50">
        <div className="w-full max-w-md">
          <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your school email"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-lg font-semibold text-white bg-orange-800 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
