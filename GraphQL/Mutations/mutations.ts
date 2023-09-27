import {gql} from '@apollo/client';

// To register User
export const REGISTER_USER = gql`
  mutation RegisterUser($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
      username
      email
      password
      token
    }
  }
`;

// To login User
export const LOGIN_USER = gql`
  mutation LoginUser($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      email
      password
    }
  }
`;
