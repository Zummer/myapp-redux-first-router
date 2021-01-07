import React from 'react';
import {connect} from 'react-redux';
import {LoginForm} from './LoginForm';
import {login, setFormErrors} from '../actions/login';
import {addFlashMessage} from '../actions/flashMessages';
import {IAppState, IFlashMessage, ILoginParams} from '../Models';
import {AnyAction} from 'redux';
import Loading from './Loading';

interface IStateProps {
  errors: any;
  isLoading: boolean;
}

interface IDispatchProps {
  addFlashMessage: (message: IFlashMessage) => AnyAction;
  setFormErrors: (errors: any) => AnyAction;
  login: (params: ILoginParams) => Promise<void>;
}

type TProps = IStateProps & IDispatchProps;

const Login: React.FunctionComponent<TProps> = (props: TProps) => {
  return (
    <div className="registerPage">
      {props.isLoading && <Loading />}
      <div className="col-md-4 col-md-offset-4">
        <LoginForm {...props} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => {
  const {errors, isLoading} = state.login;
  return {
    errors,
    isLoading,
  };
};

export default connect(mapStateToProps, {
  login,
  setFormErrors,
  addFlashMessage,
})(Login);
