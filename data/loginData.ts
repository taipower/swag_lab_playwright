export const loginData = [
  {
    name: 'Both username and password are empty',
    username: '',
    password: '',
    expected: 'Epic sadface: Username is required'
  },
  {
    name: 'Username is empty',
    username: '',
    password: 'secret_sauce',
    expected: 'Epic sadface: Username is required'
  },
  {
    name: 'Password is empty',
    username: 'standard_user',
    password: '',
    expected: 'Epic sadface: Password is required'
  },
  {
    name: 'Invalid username',
    username: 'taipower',
    password: 'secret_sauce',
    expected: 'Epic sadface: Username and password do not match any user in this service'
  }
];