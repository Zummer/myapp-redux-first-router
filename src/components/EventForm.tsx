import React from 'react';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {createEvent} from '../actions/events';
import {TextFieldGroup} from './TextFieldGroup';

interface IDispatchProps {
  createEvent: (event: any) => AnyAction;
}

interface IState {
  title: string;
  errors: any;
  isLoading: boolean;
}

type TProps = IDispatchProps;

class EventForm extends React.Component<TProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      errors: {},
      isLoading: false,
    };
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.createEvent(this.state);
  };

  render() {
    const {title, errors, isLoading} = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <h1>Create New Game Event</h1>

        <TextFieldGroup
          field="title"
          label="Event Title"
          value={title}
          onChange={this.onChange}
          error={errors.title}
        />

        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    );
  }
}

export default connect(null, {createEvent})(EventForm);
