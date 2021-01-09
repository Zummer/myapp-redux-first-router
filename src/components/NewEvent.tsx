import React from 'react';
import EventForm from './EventForm';
import {withRequireAuth} from './withRequireAuth';

class NewEvent extends React.Component {
  render() {
    return (
      <div>
        <EventForm />
      </div>
    );
  }
}

export default withRequireAuth(NewEvent);
