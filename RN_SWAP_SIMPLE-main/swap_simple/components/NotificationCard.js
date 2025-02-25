import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Icon } from 'react-native-elements';

export default function NotificationCard(props) {
  const user = useSelector((state) => state.user);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [seen, setSeen] = useState(props.seen);
  const [active, setActive] = useState(props.active);
  const [isDeleted, setIsDeleted] = useState(false);

  const toggleMessageVisibility = async () => {
    setShowFullMessage(!showFullMessage);
    if (!seen) {
      await markNotificationAsSeen();
    }
  };

  const markNotificationAsSeen = async () => {
    try {
      const res = await fetch(
        `http://10.10.92.56:3000/api/pnr/markNotificationAsSeen/${user.currentUser._id}/${props.notificationId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seen: true }),
        }
      );
      if (res.ok) {
        console.log('Notification marked as seen successfully');
      } else {
        console.error('Failed to mark notification as seen');
      }
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
    setSeen(true);
  };

  const deactivateNotification = async () => {
    try {
      const res = await fetch(
        `http://10.10.92.56:3000/api/pnr/deactivateNotification/${user.currentUser._id}/${props.notificationId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: false }),
        }
      );
      if (res.ok) {
        console.log('Notification deactivated successfully');
      } else {
        console.error('Failed to deactivate notification');
      }
    } catch (error) {
      console.error('Error deactivating notification', error);
    }
    setActive(false);
  };

  const handleSuccess = async () => {
    try {
    setActive(false);

      if (props.subject === 'AcceptSeatSwap') {
        const res = await fetch('http://10.10.92.56:3000/api/pnr/acceptSwap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            travelId1: props.ownTravelId,
            travelId2: props.otherTravelId,
          }),
        });

        if (res.ok) {
          console.log('Swap request accepted successfully');
        } else {
          console.error('Failed to accept swap request');
        }
      } else if (props.subject === 'ConfirmYourSwap') {
        const res = await fetch('http://10.10.92.56:3000/api/pnr/confirmSwap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.currentUser._id,
            ownTravelId: props.ownTravelId,
            otherTravelId: props.otherTravelId,
          }),
        });
        console.log(res);

        if (res.ok) {
          console.log('Swap confirmed successfully');
        } else {
          console.error('Failed to confirm swap');
        }
      }
    } catch (error) {
      console.error('Error handling success:', error);
    }

    // setActive(false);
    deactivateNotification();
  };

  const handleFailure = async () => {
    try {
    setActive(false);

      const res = await fetch('http://10.10.92.56:3000/api/pnr/rejectSwapRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterTravelId: props.otherTravelId,
          rejecterTravelId: props.ownTravelId,
        }),
      });

      if (res.ok) {
        console.log('Swap request rejected successfully');
      } else {
        console.error('Failed to reject swap request');
      }
    } catch (error) {
      console.error('Error handling failure:', error);
    }
    // setActive(false);
    deactivateNotification();
  };

  const handleDelete = async () => {
    try {
      if (props.takeResponse && active) {
        Alert.alert(
          'Unanswered Query',
          'You have some unanswered queries in the message. Please complete it before deleting.',
          [{ text: 'OK' }]
        );
        return;
      }
      Alert.alert(
        'Delete Notification',
        'Are you sure you want to delete this notification?',
        [
          { text: 'Cancel' },
          {
            text: 'Delete',
            onPress: async () => {
              const res = await fetch('http://10.10.92.56:3000/api/pnr/deleteNotification', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  notificationId: props.notificationId,
                }),
              });

              if (res.ok) {
                console.log('Notification deleted successfully');
                setIsDeleted(true);
              } else {
                console.error('Failed to delete notification');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting notification', error);
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#d3def0', '#aab4d1']} // Gradient colors
      // colors={['#cc3300', '#003366']}
      style={styles.cardContainer}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerContainer}>
          {!seen && <Icon name="circle" type="font-awesome" color="#36bf2c" size={20} />}
          <Text style={styles.subjectText}>{props.subject}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={[styles.messageText, { fontWeight: seen ? 'normal' : 'bold' }]}>
            {showFullMessage ? props.message : `${props.message.slice(0, 50)}...`}
          </Text>
          <TouchableOpacity onPress={toggleMessageVisibility} style={styles.toggleButton}>
            <FontAwesome5 name={showFullMessage ? 'chevron-up' : 'chevron-down'} size={20} />
            {showFullMessage && <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <FontAwesome5 name="trash" color="brown" size={24} />
            </TouchableOpacity>}
          </TouchableOpacity>
        </View>
        {showFullMessage && (
          <View style={styles.actionsContainer}>
            {props.takeResponse && (
              <View style={styles.buttonsContainer}>
                <LinearGradient
                  colors={['#009900', '#008000']}
                  style={styles.actionButton}
                >
                  <TouchableOpacity
                    onPress={handleSuccess}
                    disabled={!active}
                    style={[styles.buttonContent, !active && styles.disabledButton]}
                  >
                    <Text style={styles.buttonText} numberOfLines={1}>{props.subject}</Text>
                    {!active && <FontAwesome5 name="ban" size={16} color="#fff" />}
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={['#a33957','#a33957', '#a33957','#800000']}
                  style={styles.actionButton}
                >
                  <TouchableOpacity
                    onPress={handleFailure}
                    disabled={!active}
                    style={[styles.buttonContent, !active && styles.disabledButton]}
                  >
                    <Text style={styles.buttonText} numberOfLines={1}>Reject</Text>
                    {!active && <FontAwesome5 name="ban" size={16} color="#fff" />}
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}
            {/* <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <FontAwesome5 name="trash" color="brown" size={24} />
            </TouchableOpacity> */}
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    marginRight: 4,
    overflow: 'hidden',
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  toggleButton: {
    paddingHorizontal: 8,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14,
    marginTop:4,
  },
});
