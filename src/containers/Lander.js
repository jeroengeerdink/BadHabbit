import React from "react";
import { H1, H2, P, Button, BodyWrapper } from "../components";
import { withRouter } from "react-router-dom";

const Lander = props => {
  const signIn = () => {
    props.history.push("/signin");
  };

  return (
    <BodyWrapper>
      <H1>Bad Habbit Tracker</H1>
      <H2>
        If you have a strong personality and want to allow other time to shine, tyhis tool if for you. Bad Habbit Tracker allows you to track your your interruptions and buold in that little buffer before you talk.
      </H2>
      <P>
      </P>
      <Button onClick={signIn}>Lets get started</Button>
    </BodyWrapper>
  );
};

export default withRouter(Lander);
