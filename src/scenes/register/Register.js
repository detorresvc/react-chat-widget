import React, { useState } from 'react';
import { Icon, InputText, InputWithLabel, Button } from 'components';
import { useMutation, gql } from 'graphql/client';
import Cookies from 'js-cookie';

const REGISTER = gql`
  mutation ConsumerRegister($email: String!, $name: String!, $password: String!, $confirm_password: String!) {
    register(email: $email, name: $name, password: $password, confirm_password: $confirm_password)
  }
`;

const INITIAL_FORM_DATA = {
  email: '',
  name: '',
  password: '',
  confirm_password: ''
}

function Register(){
  const [onRegister] = useMutation(REGISTER, {
    onCompleted: (data) => {
      if(data?.register){
        if(data){
          Cookies.set('echat:token', data?.register)
          window.location.href = "/"
        }
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
    onRegister({
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
                <p>REGISTER</p>
                <InputWithLabel label="Email">
                  <InputText 
                    type="email"
                    name="email"
                    onChange={handleOnChange}
                    value={formData.email}
                  />
                </InputWithLabel>
                <InputWithLabel label="Company Name">
                  <InputText 
                    type="text"
                    name="name"
                    onChange={handleOnChange}
                    value={formData.name}
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
                <InputWithLabel label="Confirm Password">
                  <InputText 
                    type="password"
                    name="confirm_password"
                    onChange={handleOnChange}
                    value={formData.confirm_password}
                    />
                </InputWithLabel>
                
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <Button type="submit">Register</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Register