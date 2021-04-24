import React, { useState, useContext, useEffect } from "react";
import { P, H1, Button, Input, Form, BodyWrapper } from "../components";
import { UserContext } from "../contexts/userContext";
import { ToastContext } from "../contexts/toastContext";
import firebase from "../firebase.js";
import "firebase/firestore";

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

  const feedbackPanel = () => {
    return (
      <BodyWrapper>
        <H1>Session Feedback</H1>
        <P>
          <div>
          <Button onClick={() => setInterruptions(interruptions + 1)}>Interrupt {interruptions}</Button>
          </div>
          <div>
          <Button onClick={() => setRude(rude + 1)}>Rude {rude}</Button>
          </div>
          <div>
          </div>
        </P>
      </BodyWrapper>
    );
  };
  return feedbackPanel()
};

export default SessionFeedback;
