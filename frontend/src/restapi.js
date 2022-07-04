//import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';


/**  
const requestAccessToken = () => {
  const url = 'http://127.0.0.1:8000/api/token/refresh/';
  
  // Use new instance to skip middleware  
  return axios.post(url, {
    'refresh': restApiClient.tokenService.getLocalRefreshToken(),
  });
}
*/



class ToDoApi {
  
  constructor() {
    //this.baseURL = 'http://127.0.0.1:8000/api';
    this.baseURL = window.location.protocol + '//' + window.location.hostname + ':8000/api/';
    console.log('> Api host ' + this.baseURL)      



    this.refreshURL = this.baseURL + 'token/refresh/';
    this.loginURL = '#/login';
    this.csrftoken = null;
    
    let service = axios.create({
      baseURL: this.baseURL,
      headers: {'Content-Type': 'application/json'},
      //withCredentials: true
    });
    
    service.interceptors.request.use(this.handleRequest);
    service.interceptors.response.use(this.handleSuccess, this.refreshToken);
 
    // Add a response interceptor
    // Response interceptor for API calls
    /**
    service.interceptors.response.use((response) => {
      return response
    }, async (error) => {
      
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const res = await requestAccessToken();            
        console.log('> Token received ' + res.data.access)
        this.tokenService.updateLocalAccessToken(res.data.access)
        console.log('Retry')
        return service(originalRequest);
      }
      
      return Promise.reject(error);
    });
    */

    this.service = service;
    this.tokenService = new TokenService
    this.csrftoken = '';        // ?
  }


  /**
   * Interceptor for incomming response
   * @ Handle 401 (Unauthorized) status of response and provides token refresh action
   * @ Retry previous request
   */
  refreshToken = async (error)  => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await this.requestAccessToken();            
          //console.log('> Token received ' + res.data.access)
          this.tokenService.updateLocalAccessToken(res.data.access)
          return this.service(originalRequest);
        } catch (err) {
          if (err.request.status == 401) {
            console.log('>>> Refresh token expired, you need to login again')
            this.redirectTo(this.loginURL); 
          } 
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
  }
 
  /**
   * Custom POST request to get new `access` token by `refresh`` token  
   * utilizes new instance of axios to disable refreshToken middleware 
   */ 
  requestAccessToken() {
    const payload = {'refresh': this.tokenService.getLocalRefreshToken()};
    return axios.post(this.refreshURL, payload)
  } 

  handleSuccess(response) {
    return response;
  }

  handleError = (error) => {
  
    /**
    switch (error.response.status) {
      case 401:
        this.redirectTo(document, '/')
        break;
      case 404:
        this.redirectTo(document, '/404')
        break;
      default:
        this.redirectTo(document, '/500')
        break;
    }
    */
    
    return Promise.reject(error)
  }

  /**
   * Interceptor for outcoming request
   * @ Incects api JWT authorization token
   * @ Set version of api
   */

  handleRequest = (request) => {
    request.headers.Authorization = `Bearer ${this.tokenService.getLocalAccessToken()}`
    request.headers.common.Accept = '*/*;version=2.0'
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    console.log(request)
    return request
  }

  redirectTo = (path) => {
    document.location = path
  }
  
  get(path) {
    return this.service.get(path).then(
      (response) => this.responseHandler(response)
    );
  }

  patch(path, payload) {
    return this.service.request({
      method: 'PATCH',
      url: path,
      responseType: 'json',
      data: payload
    })    

    /**
    return this.service.request({
      method: 'PATCH',
      url: path,
      responseType: 'json',
      data: payload
    }).then((response) => callback(response.status, response.data));
    */

  }

  put(path, payload) {
    return this.service.request({
      method: 'PUT',
      url: path,
      responseType: 'json',
      data: payload
    })    
  }

  del(path, payload) {
    console.log('>>> Del ' + path)
    return this.service.request({
      method: 'DELETE',
      url: path,
      responseType: 'json',
    })    
  }



  post(path, payload) {
    
    //payload.csrfmiddlewaretoken = this.csrftoken;

    return this.service.request({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: path,
      responseType: 'json',
      data: payload
    

    }).then((response) => this.responseHandler(response));
  }

  responseHandler(response) {
    
    console.log('> Response handler')
    
    const cookies = new Cookies();
    const csrftoken = cookies.get('csrftoken');
    
    if (csrftoken) {
      console.log('> csrftoken')
      console.log(csrftoken)
      this.csrftoken = csrftoken;    
        
    }


    //this.csrftoken = csrftoken;    
    console.log('> Response handler ' + csrftoken)
    console.log(response)
    return response;
  }





  // Rename to requestLogin 
  login(path, payload) {
     
    payload = {'username': 'luke', 'password': 'luke'}
    console.log('> Login') 

    return this.service.request({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: path,
      responseType: 'json',
      data: payload
 
    }).then((response) => {
      if ( !response.data.hasOwnProperty('access')) {  
        console.log('No access field in response')
        console.log(response)
        throw new Error('Required')
      }
      this.tokenService.setUser(response.data)
      return response.data
    
    });
  




  }







  currentUser = async () => {
    const res = this.tokenService.getUser();
    if (res) {
      const response = await restApiClient.get('customer/current/');
      return response.data
    }
  };

















}


class TokenService {
  
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refresh;
  }
  
  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.access;
  }
    
  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.access = token;
    localStorage.setItem("user", JSON.stringify(user));
  }
  
  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  
  setUser(user) {
    console.log(JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
  }
  
  removeUser() {
    localStorage.removeItem("user");
  }
}




//export default new TokenService();






























// Replace with interact
const restApiClient = new ToDoApi(); //axios.create({BASE_URL: 'http://127.0.0.1:8000/api/'})


















export default restApiClient;

//export default ToDoApi;
//export var ApiClient = new ToDoApi(); //axios.create({BASE_URL: 'http://127.0.0.1:8000/api/'})




