
import React, { useState, useEffect, useRef } from "react";
import IconButton from '@material-ui/core/IconButton';


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

const TimeDelayButton = props => {
  const [color, setColor] = useState("white");
  const [content, setContent] = useState(props.children);
  const [counter, setCounter] = useState(props.countdown);
  const delay = 1000
  const [isPlaying, setPlaying] = useState(false)

  useInterval(() => {
    setCounter(counter - 1);
    setContent(displayText(counter));
    if (counter === 1) {
      setColor("green");
    }
    if (counter === 0) {
      setPlaying(false);
      setContent(displayText("GO"));
      setTimeout(() => {
        setColor("white");
        setContent(props.children);
        setCounter(10);
      }, 5000);
    }
  }, isPlaying ? delay : null);

  const displayText = (text) => {
    return <div style={{
      fontSize: 120,
      width: 200,
      height: 200,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }} >{text}</div>;
  }

  const handleClick = (e) => {
    if (!isPlaying) {
      props.onClick(e);
      setColor("red");
      setContent(displayText(counter));
      setPlaying(true);
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
