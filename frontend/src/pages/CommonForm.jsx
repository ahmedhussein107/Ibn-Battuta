import "../styles/CommonForm.css";

import React from "react";

const CommonFormStep = ({ userData, onChange }) => {
  return (
    <div className="common-form-step">
      {/* Photo Input */}
      <div className="form-group">
        <label>
          Photo
          <input
            type="file"
            name="commonPhoto"
            accept="image/*"
            onChange={onChange}
            required
          />
        </label>
      </div>

      {/* Name Input */}
      <div className="form-group">
        <label>Name </label>
        <input
          type="text"
          name="name"
          value={userData.name || ""}
          onChange={onChange}
          placeholder="Enter your name"
          required
        />
      </div>

      {/* Username Input */}
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={userData.username || ""}
          onChange={onChange}
          placeholder="Enter your username"
          required
        />
      </div>

      {/* Email Input */}
      <div className="form-group">
        <label>Email</label>

        <input
          type="email"
          name="email"
          value={userData.email || ""}
          onChange={onChange}
          placeholder="Enter your email"
          required
        />
      </div>

      {/* Password Input */}
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={userData.password || ""}
          onChange={onChange}
          placeholder="Enter your password"
          required
        />
      </div>
    </div>
  );
};

export default CommonFormStep;
