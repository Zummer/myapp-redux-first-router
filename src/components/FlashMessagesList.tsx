import React from 'react';
import {connect} from 'react-redux';
import {IAppState, IFlashMessage} from '../Models';
import {FlashMessage} from './FlashMessage';
import {deleteFlashMessage} from '../actions/flashMessages';
import {memoize} from 'lodash';

interface IStateProps {
  messages: IFlashMessage[];
}

interface IDispatchProps {
  deleteFlashMessage: (id: string) => void;
}

type TProps = IStateProps & IDispatchProps;

class FlashMessagesList extends React.Component<TProps> {
  handleClick = memoize(
    (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      this.props.deleteFlashMessage(id);
    }
  );

  render() {
    const messages = this.props.messages.map((message) => {
      return (
        <FlashMessage
          key={message.id}
          message={message}
          onClick={this.handleClick(message.id)}
        />
      );
    });

    return <div>{messages}</div>;
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  return {
    messages: state.flashMessages,
  };
};

export default connect(mapStateToProps, {deleteFlashMessage})(
  FlashMessagesList
);
