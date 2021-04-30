import React, { useState, useContext, useEffect } from "react";
import IconButton from '@material-ui/core/IconButton';
import { P, H1, Button, Input, Form, BodyWrapper, Icon } from "../components";
import { UserContext } from "../contexts/userContext";
import { ToastContext } from "../contexts/toastContext";
import firebase from "../firebase.js";
import { metrics, icons } from "../themes";
import { makeStyles } from '@material-ui/core/styles';
import BlockIcon from '@material-ui/icons/Block';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import "firebase/firestore";
import { RoundedCorner } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const SessionFeedback = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [interruptions, setInterruptions] = useState(0);
  const [rude, setRude] = useState(0);
  const [moreInfoComplete, setMoreInfoComplete] = useState(false);
  const { userState, userDispatch } = useContext(UserContext);
  const { sendMessage } = useContext(ToastContext);
  const db = firebase.firestore();

  useEffect(() => {
    if (
      (moreInfoComplete || userState.userData.firstName) &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      requestNotifications();
    }
  }, []);

  const requestNotifications = () => {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        const messaging = firebase.messaging();
        messaging
          .getToken()
          .then(currentToken => {
            db.collection("users")
              .doc(firebase.auth().currentUser.uid)
              .set({ pushTokenWeb: currentToken }, { merge: true })
              .then(() => {
                sendMessage("Notifications activated!");
              })
              .catch(err => console.log(err));
          })
          .catch(err => {
            console.log("An error occurred while retrieving token.", err);
          });
      }
    });
  };

  const closeSession = e => {
    /*e.preventDefault();*/
    if (interruptions && rude) {
      db.collection("sessionfeedback")
        .doc(firebase.auth().currentUser.uid)
        .set(
          {
            user: firebase.auth().currentUser.uid,
            interruptions: interruptions,
            rude: rude
          },
          { merge: true }
        );
    }
  };

  const feedbackPanel = () => {
    const classes = useStyles();

    return (
      <BodyWrapper>
        <H1>Session Feedback</H1>
        <div className={classes.root}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={12}>
            <Grid item justify="center" alignItems="center" xs>
              <Badge badgeContent={interruptions} color="secondary">
                <IconButton onClick={() => setInterruptions(interruptions + 1)}>
                  <BlockIcon style={{ fontSize: 200 }} />
                </IconButton>
              </Badge>
            </Grid>
            <Grid item justify="center" alignItems="center" xs>
              <Badge badgeContent={rude} color="secondary">
                <IconButton onClick={() => setRude(rude + 1)}>
                  <AvTimerIcon style={{ fontSize: 200 }} />
                </IconButton>
              </Badge>
            </Grid>
            <Grid item xs={12} justify="center" alignItems="center">
              <Button style={{ width: "100%" }} onClick={() => closeSession()}>Finish</Button>
            </Grid>
          </Grid>
        </div>
      </BodyWrapper>
    );
  };
  return feedbackPanel()
};

export default SessionFeedback;
