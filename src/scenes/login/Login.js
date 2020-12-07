import React, { useState } from 'react';
import { Icon, InputText, InputWithLabel, Button } from 'components';
import { useMutation, gql } from 'graphql/client';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { isAthenticatedVar } from 'graphql/cache'; 

const SIGN_IN = gql`
  mutation UserLogin($email: String, $password: String) {
    login(email: $email, password: $password)
  }
`;

const INITIAL_FORM_DATA = {
  email: '',
  password: ''
}

function Login(){
  const [onSignIn] = useMutation(SIGN_IN, {
    onCompleted: (data) => {
      if(data?.login){
        Cookies.set('echat:token', data?.login)
        isAthenticatedVar(true)
        window.location.href = "/"
      }
    }
  });
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  const handleOnChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSignIn({
      variables: formData
    })
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-200 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div> 
              <Icon.Chat className="w-20 h-20"/>
            </div>
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>SIGN IN</p>
                <InputWithLabel label="Email">
                  <InputText 
                    type="email"
                    name="email"
                    onChange={handleOnChange}
                    value={formData.email}
                  />
                </InputWithLabel>
                <InputWithLabel label="Password">
                  <InputText 
                    type="password"
                    name="password"
                    onChange={handleOnChange}
                    value={formData.password}
                    />
                </InputWithLabel>
                
              </div>
              <div className="pt-6 text-base leading-6 sm:text-lg sm:leading-7 flex gap-x-2 items-center">
                <Button type="submit">Sign In</Button>
                <Link to="/register" className="text-xs">Register</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Login