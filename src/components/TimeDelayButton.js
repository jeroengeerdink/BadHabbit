
import React, { useState, useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { metrics } from "../themes";
import IconButton from '@material-ui/core/IconButton';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import { makeStyles } from '@material-ui/core/styles';

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const TimeDelayButton = parameters => {
  const [color, setColor] = useState("white");
  const [props, setProps] = useState(parameters);
  const [content, setContent] = useState(<AvTimerIcon style={{ fontSize: 200 }} />);
  const [counter, setCounter] = useState(props.countdown);
  const [delay, setDelay] = useState(1000)
  const [isPlaying, setPlaying] = useState(false)

  let intervalRef = useInterval(() => {
    console.log("In loop > " + counter);
    setCounter(counter - 1);
    setContent(displayText(counter));
    if (counter == 0) {
      console.log("zero");
      setPlaying(false);
      setContent(displayText("GO"));
      setColor("green");
      setTimeout(() => {
        setColor("white");
        setContent(<AvTimerIcon style={{ fontSize: 200 }} />);
      }, 5000);
    }
  }, isPlaying ? delay : null);

  const displayText = (text) => {
    return <div style={{ fontSize: 150, width: 200, height: 200, texAlign: "center", verticalAlign: "middle" }} >{text}</div>;
  }

  const handleClick = (e) => {
    if (!isPlaying) {
      console.log("start animation >" + props.countdown);
      setColor("red");
      //setCounter(props.countdown);
      console.log("Counter > " + counter);
      setContent(displayText(counter));
      setPlaying(true);
      props.onClick(e);
    }
    else {
      // ignore
    }
  }

  return (
    <IconButton {...props} onClick={handleClick} style={{
      background: color,
      transition: "all 2.5s ease",
      WebkitTransition: "all 2.5s ease",
      MozTransition: "all 2.5s ease"
    }} >
      {content}
    </IconButton>
  );

};

export default TimeDelayButton;
