import React, { useState, useContext, useEffect } from "react";
import { P, H1, Button, Input, Form, BodyWrapper } from "../components";
import { UserContext } from "../contexts/userContext";
import { ToastContext } from "../contexts/toastContext";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import firebase from "../firebase.js";
import "firebase/firestore";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DateRangeIcon from '@material-ui/icons/DateRange';
import WarningIcon from '@material-ui/icons/Warning';
import PanToolIcon from '@material-ui/icons/PanTool';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TimerIcon from '@material-ui/icons/Timer';

const Dashboard = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [moreInfoComplete, setMoreInfoComplete] = useState(false);
  const { userState, userDispatch } = useContext(UserContext);
  const { sendMessage } = useContext(ToastContext);
  const db = firebase.firestore();
  const history = useHistory();
  const sessionfeedbackRef = db.collection('sessionfeedback');
  const [feedbackItems, setFeedbackItems] = useState([]);
  let loaded = false;

  useEffect(() => {
    if (
      (moreInfoComplete || userState.userData.firstName) &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      requestNotifications();
    }
  }, []);

  const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 400,
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  }));

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

  const getFeedbackItems = async () => {
    const items = [];
    if (!loaded) {
      loaded = true;
      console.log("UID > " + firebase.auth().currentUser.uid);
      //orderBy('starttime', 'desc')
      const snapshot = await sessionfeedbackRef
        .where("owner", "==", firebase.auth().currentUser.uid)
        .orderBy('starttime', 'desc')
        .limit(10)
        .get();
      if (!snapshot.empty) {
        console.log('We have results');
        snapshot.forEach(doc => {
          items.push(doc.data());
        });
      }
    }
    setFeedbackItems(items);
  }

  const onClickSubmit = e => {
    e.preventDefault();
    if (firstName && lastName) {
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .set(
          {
            firstName: firstName,
            lastName: lastName
          },
          { merge: true }
        )
        .then(() => {
          userDispatch({
            type: "updateProfile",
            payload: {
              firstName: firstName,
              lastName: lastName
            }
          });
          setMoreInfoComplete(true);
          sendMessage("Welcome!");
          requestNotifications();
        });
    } else {
      sendMessage("Please complete the form.");
    }
  };

  const moreInfo = () => {
    return (
      <BodyWrapper>
        <H1>Onboarding</H1>
        <P>
          Welcome to the Bad Habbit Tracker! To continuue please complete the small profile below.
        </P>
        <Form>
          <div>
            <Input
              onChange={e => setFirstName(e.target.value)}
              name="firstName"
              placeholder="First name"
              autoComplete="given-name"
            />
          </div>
          <div>
            <Input
              onChange={e => setLastName(e.target.value)}
              name="lastName"
              placeholder="Last name"
              autoComplete="family-name"
            />
          </div>
          <Button onClick={e => onClickSubmit(e)}>Submit</Button>
        </Form>
      </BodyWrapper>
    );
  };

  const dashboard = () => {
    const classes = useStyles();

    return (
      <BodyWrapper>
        <H1>Dashboard</H1>
        <P>
          To be completed with some nice graphs :)
          Get started with the button below....
        </P>
        <div className={classes.demo}>
          <List>
            {feedbackItems.map((item) =>
              <ListItem key={item.key} >
                <Card className={classes.root}>
                  <CardContent>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                      <DateRangeIcon />
                      {new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric"
                      }).format(item.starttime)}
                    </Typography>
                    <Typography variant="h4" component="h2">
                      <WarningIcon /> {item.numberOfInterruptions} &nbsp;&nbsp;&nbsp;&nbsp;
                      <PanToolIcon /> {item.numberOfIntentToTalk} &nbsp;&nbsp;&nbsp;&nbsp;
                      <TimerIcon /> {item.duration}

                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            )}
          </List>
        </div>
        <Fab color="primary" aria-label="add" className={classes.fab}>
          <AddIcon onClick={() => { history.push('/sessionfeedback'); }} ></AddIcon>
        </Fab>
      </BodyWrapper>
    );
  };


  useEffect(() => {getFeedbackItems()}, [])

  return moreInfoComplete || userState.userData.firstName
    ? dashboard()
    : moreInfo();

};

export default Dashboard;
