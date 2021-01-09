import React from 'react';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {redirect} from 'redux-first-router';
import {IAppState} from 'src/Models';

interface IStateProps {
  isAuthenticated: boolean;
}

interface IDispatchProps {
  redirect: (action: AnyAction) => AnyAction;
}

type TProps = IStateProps & IDispatchProps;

export function withRequireAuth(WrappedComponent: any) {
  class Authenticate extends React.Component<TProps> {
    componentDidUpdate(prevProps, _prevState) {
      const {isAuthenticated, redirect} = this.props;

      if (prevProps.isAuthenticated !== isAuthenticated && !isAuthenticated) {
        redirect({type: 'LOGIN'});
      }
    }

    render() {
      const {isAuthenticated} = this.props;

      if (!isAuthenticated) {
        return null;
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state: IAppState): IStateProps => {
    return {
      isAuthenticated: state.auth.isAuthenticated,
    };
  };

  return connect(mapStateToProps, {redirect})(Authenticate);
}
