/**
 * Wrap a component in a div with a background
 * Allows for CSS transitions to only apply to the content
 */

import React from 'react';
import styled from 'styled-components';

const withBackground = WrapperWithBackground => WrappedComponent => {
  return props => {
    return (
      <WrapperWithBackground>
        <WrappedComponent {...props} />
      </WrapperWithBackground>
    );
  };
};

export const Wrapper = backgroundUrl => styled.div`
  background: url('${backgroundUrl}') no-repeat;
  background-size: cover;
  height: 100%;
  overflow: hidden;
`;

export default withBackground;
