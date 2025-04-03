"use client";
import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null); // State can be null initially

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setProfile(parsedUser);
    }
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save updated profile to localStorage
  const handleSave = () => {
    if (!profile) return;
    localStorage.setItem("user", JSON.stringify(profile));
    alert("Profile updated successfully! ✅");
  };

  // If profile data is not yet loaded, show a loading state
  if (!profile) {
    return <div className="text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 border-t-black border-2">
      {/* Profile Header */}
      <div className="flex flex-col items-center">

       
        <h1 className="text-2xl font-semibold mt-3">
          {profile.user.name || "Admin"} {profile.user.surname || ""}
        </h1>
        <p className="text-gray-500">@{profile.user.username}</p>
      </div>

      {/* Profile Details */}
      <div className="mt-6 space-y-4">
        {/* Username (for all users) */}
        <div>
          <label className="text-gray-600 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={profile.user.username}
            disabled
            className="w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Show extra fields only if the user is NOT an admin */}
        {profile.role !== "ADMIN" && (
          <>
            {/* Name */}
            <div>
              <label className="text-gray-600 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.user.name || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Surname */}
            <div>
              <label className="text-gray-600 font-medium">Surname</label>
              <input
                type="text"
                name="surname"
                value={profile.user.surname || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-600 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={profile.user.email || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-600 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.user.phone || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-gray-600 font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={profile.user.address || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>

      {/* Show Save button only if the user is NOT an admin */}
      {profile.role !== "ADMIN" && (
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 w-full"
          >
            Update Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
