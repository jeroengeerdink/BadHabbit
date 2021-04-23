import React, { useState, useContext, useEffect } from "react";
import { P, H1, Button, Input, Form, BodyWrapper } from "../components";
import { UserContext } from "../contexts/userContext";
import { ToastContext } from "../contexts/toastContext";
import firebase from "../firebase.js";
import "firebase/firestore";

const SessionFeedback = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [interruptions, addInterruption] = useState(null);
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

  const onClickSubmit = e => {
    e.preventDefault();
    if (firstName && lastName) {
      db.collection("sessionfeedback")
        .doc(firebase.auth().currentUser.uid)
        .set(
          {
            user: firebase.auth().currentUser.uid,
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
        <H1>Please login first</H1>
      </BodyWrapper>
    );
  };

  const dashboard = () => {
    return (
      <BodyWrapper>
        <H1>Session Feedback</H1>
        <P>
        <Form>
          <div>
          <Button onClick={e => onClickSubmit(e)}>Interrupt</Button>
          <Button onClick={e => onClickSubmit(e)}>Rude</Button>
          <Button onClick={e => onClickSubmit(e)}>Axcious</Button>
          </div>

          <Button onClick={e => onClickSubmit(e)}>Submit</Button>
        </Form>
        </P>
      </BodyWrapper>
    );
  };
  return moreInfoComplete || userState.userData.firstName
    ? dashboard()
    : moreInfo();
};

export default SessionFeedback;
