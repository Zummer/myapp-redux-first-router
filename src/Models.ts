import {EFlashMessageType, ERequestActionStatus} from './Enums';

export interface IUserRegisterParams {
  email: string;
  displayName: string;
  password: string;
  passwordRepeat: string;
}

export interface ILoginParams {
  email: string;
  password: string;
}

interface IActionError {
  errors: any;
}

export interface IActionWith {
  type: string;
  status: ERequestActionStatus;
  payload?: any;
  error?: IActionError;
  errorMessage?: string;
}

export interface IBaseState {
  data?: any;
  errors?: any;
  isLoading: boolean;
}

export interface IAuthState {
  isAuthenticated: boolean;
  user: IAppUser;
}

export interface IAppState {
  userRegister: IBaseState;
  actions: any;
  playing: any;
  flashMessages: any;
  login: any;
  location: any;
  auth: IAuthState;
}

export interface IFlashMessage {
  id: string;
  type: EFlashMessageType;
  text: string;
}

export interface IValidationResult {
  errors: any;
  isValid: boolean;
}

export interface IAppUser {
  id: string;
  username: string;
  roles: string[];
}
