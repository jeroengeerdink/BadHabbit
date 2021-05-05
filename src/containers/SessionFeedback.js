import React, { useState } from "react";
import IconButton from '@material-ui/core/IconButton';
import { TimeDelayButton } from "../components";
import firebase from "../firebase.js";
import { makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import PanToolIcon from '@material-ui/icons/PanTool';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Fab from '@material-ui/core/Fab';
import CardContent from '@material-ui/core/CardContent';
import { Overlay } from "../components";
import { useHistory } from 'react-router-dom';

import "firebase/firestore";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 30
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  fab: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  badge: {
    fontSize: 30,
    padding: 20
  },
}));

const SessionFeedback = (props) => {
  const [interruptions, setInterruptions] = useState(0);
  const timestamp = Date.now();
  const [intents, setIntents] = useState(0);
  const db = firebase.firestore();
  const history = useHistory();

  const closeSession = e => {
    const endTime = Date.now();
    const obj = {
      owner: firebase.auth().currentUser.uid,
      numberOfInterruptions: interruptions,
      numberOfIntentToTalk: intents,
      starttime: timestamp,
      endtime: endTime,
      duration: Math.round((((endTime - timestamp) % 86400000) % 3600000) / 60000)
    };
    console.log(obj);
    console.log(interruptions);
    console.log(intents);
    db.collection("sessionfeedback")
      .doc(firebase.auth().currentUser.uid + "" + timestamp)
      .set(
        obj,
        { merge: true }
      );
    history.push('/dashboard');
  };


  const feedbackPanel = () => {
    const classes = useStyles();

    return (
      <Overlay>
        <Fab color="primary" aria-label="add" className={classes.fab}>
          <ExitToAppIcon onClick={() => closeSession()}></ExitToAppIcon>
        </Fab>
        <div className={classes.root}>
          <Grid
            container
            direction="row"
            alignItems="center"
            style={{ textAlign: "center" }}
            spacing={1}>
            <Grid item  xs>
              <Badge badgeContent={interruptions} color="secondary" classes={{ badge: classes.badge }}>
                <Card className={classes.root}>
                  <CardContent>
                    <IconButton onClick={() => setInterruptions(interruptions + 1)}>
                      <WarningIcon style={{ fontSize: 200 }} />
                    </IconButton>
                  </CardContent>
                </Card>
              </Badge>
            </Grid>
            <Grid item  xs>
              <Badge badgeContent={intents} color="secondary" classes={{ badge: classes.badge }}>
                <Card className={classes.root}>
                  <CardContent>
                    <TimeDelayButton countdown={10} onClick={() => { setIntents(intents + 1) }}>
                      <PanToolIcon style={{ fontSize: 200 }} />
                    </TimeDelayButton>
                  </CardContent>
                </Card>
              </Badge>
            </Grid>
            <Grid item xs={12}>
            </Grid>
          </Grid>
        </div>
      </Overlay>
    );
  };
  return feedbackPanel()
};

export default SessionFeedback;
