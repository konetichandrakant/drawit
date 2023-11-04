import React from 'react';

const Register = () => {
  return (
    <div>
      <h2>Register</h2>
      <form>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
