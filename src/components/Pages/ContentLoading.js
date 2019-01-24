import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const ContentLoading = props => {
  return (
    <div className="app-page fixed aligned">
      <div style={{ textAlign: 'center' }}>
        <CircularProgress />
        <p>{props.text}</p>
      </div>
    </div>
  );
};

export default ContentLoading;
