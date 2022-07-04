import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";

// Rest api clent instance (axios based)
import restApiClient from '../restapi.js'

function LoginForm(props) {
  const [values, setValues] = useState({'username': '', 'password': ''});
  const [errors, setErrors] = useState({'error': ''});
  //const navigate = useNavigate();

  /**
   * Intercepts form submit action
   * Performs login to REST api on JWT token endpoint
   * After login success - request current user info
   * and update parent component state with current user
  */
  const submitForm = () => {
    restApiClient.login('token/', values).then(() => {
      restApiClient.currentUser().then(user => {
        props.update('user', user)
      });       
    }).catch(error => { 
      console.log(error.response.status)
      setErrors({'error': 'Login has failed, try again'});
    })
  }
  
  const handleChange = name => {
    return ({ target: { value } }) => {
      setValues(oldValues => ({...oldValues, [name]: value }));
    }
  };

  return (
    <div className="login-box">
      <div className="section">
        <br/>
        <h3><center>Login</center></h3>
        <div className="form-outline mb-4">
          <input 
            type="email" 
            id="form2Example1" 
            className="form-control"
            value={values.username} onChange={handleChange('username')} 
          />
          <label className="form-label" htmlFor="form2Example1">User name</label>
        </div>
        <div className="form-outline mb-4">
          <input 
            type="password" 
            className="form-control"
            value={values.password} onChange={handleChange('password')}
          />
          <label className="form-label" htmlFor="form2Example2">Password</label>
        </div>
        <div className="row mb-4">
          <div className="col d-flex justify-content-center">
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                onChange={() => console.log('checked')} />
              <label className="form-check-label" htmlFor="form2Example31"> Remember me </label>
            </div>
          </div>

        </div>
        <div className="text-center">
        <button 
          type="button" 
          className="btn btn-primary btn-block mb-4"
          onClick={submitForm}>
            Sign in
          </button>
        </div>
        <div className="col d-flex justify-content-center color-red">
          <small>{errors.error}</small>
        </div>
        <br/>
      </div>
    </div> 
  );
}

function LogoutForm(props) {
  const [user, setUser] = useState(props.user);
  const location = useLocation();
  return (
    <div className="login-box">
      <div className="section">
        <br/>
        <h3><center>You are being logged</center></h3>
        <br/>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="form2Example1">Name: {user.username}</label>
        </div>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="form2Example1">Last login: {user.lastLogin}</label>
        </div>
        <br/>
        <div className="text-center">
        <button 
          type="button" 
          className="btn btn-primary btn-block mb-4"
          onClick={props.logout}>
            Log out
          </button>
        </div>
        <br/>
      </div>
    </div> 
  );
}

const Login = (props) => {
  console.log('>>> Login form render')
  const user = props.user
  console.log(props)
  
  //const [errors, setErrors] = useState({'error': ''});
  


  const logOut = () => {
    console.log('>>> Log out')
    restApiClient.tokenService.removeUser();
    //setUser(null);
    //restApiClient.redirectTo('#/login') 
    props.update('user', null)

  }
  
  return ( user?.isActive  ? <LogoutForm user={user} logout={logOut} /> : <LoginForm update={props.update} /> )
}

export default Login;






















