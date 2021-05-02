import React, { useState, useContext, useEffect } from "react";
import IconButton from '@material-ui/core/IconButton';
import { P, H1, Button, Input, Form, BodyWrapper, Icon, TimeDelayButton } from "../components";
import { UserContext } from "../contexts/userContext";
import { ToastContext } from "../contexts/toastContext";
import firebase from "../firebase.js";
import { metrics, icons } from "../themes";
import { makeStyles } from '@material-ui/core/styles';
import BlockIcon from '@material-ui/icons/Block';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Fab from '@material-ui/core/Fab';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

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
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const SessionFeedback = () => {
  const [interruptions, setInterruptions] = useState(0);
  const timestamp = Date.now();
  const [rude, setRude] = useState(0);
  const { userState, userDispatch } = useContext(UserContext);
  const { sendMessage } = useContext(ToastContext);
  const db = firebase.firestore();

  const closeSession = e => {
    /*e.preventDefault();*/
    if (interruptions && rude) {
      db.collection("sessionfeedback").doc(firebase.auth().currentUser.uid + "" + timestamp)
        .set(
          {
            owner: firebase.auth().currentUser.uid,
            numberOfInterruptions: interruptions,
            numberOfrude: rude
          },
          { merge: true }
        );
    }
  };


  const feedbackPanel = () => {
    const classes = useStyles();

    return (
      <BodyWrapper>
        <div className={classes.root}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ textAlign: "center" }}
            spacing={12}>
            <Grid item justify="center" alignItems="center" xs>
              <Badge badgeContent={interruptions} color="secondary">
                <Card className={classes.root}>
                  <CardContent>
                    <IconButton onClick={() => setInterruptions(interruptions + 1)}>
                      <BlockIcon style={{ fontSize: 200 }} />
                    </IconButton>
                  </CardContent>
                </Card>
              </Badge>
            </Grid>
            <Grid item justify="center" alignItems="center" xs>
              <Badge badgeContent={rude} color="secondary">
                <Card className={classes.root}>
                  <CardContent>
                    <TimeDelayButton countdown={10} onClick={() => { setRude(rude + 1) }}>
                      <AvTimerIcon style={{ fontSize: 200 }} />
                    </TimeDelayButton>
                  </CardContent>
                </Card>
              </Badge>
            </Grid>
            <Grid item xs={12} justify="center" alignItems="center">
            </Grid>
          </Grid>
          <Fab color="primary" aria-label="add" className={classes.fab}>
            <CloseIcon onClick={() => closeSession()}></CloseIcon>
          </Fab>
        </div>
      </BodyWrapper>
    );
  };
  return feedbackPanel()
};

export default SessionFeedback;
