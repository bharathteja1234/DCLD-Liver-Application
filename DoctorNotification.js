import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DoctorNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://192.168.180.15/php/DoctorNotification.php');
      const responseData = await response.json();

      if (responseData.success) {
        setNotifications(responseData.notifications);
      } else {
        console.error('Failed to fetch notifications:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      const response = await fetch(`http://192.168.180.15/php/DeleteNotification.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_id: notificationId }),
      });
      const responseData = await response.json();

      if (responseData.success) {
        setNotifications(notifications.filter(notification => notification.p_id !== notificationId));
      } else {
        console.error('Failed to delete notification:', responseData.message);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Icon name="notifications" size={24} color="#007bff" />
        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationText}>{item.Notification}</Text>
          <Text style={styles.notificationDate}>{new Date(item.NotificationDate).toLocaleString()}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeNotification(item.p_id)}>
        <Icon name="delete" size={24} color="#ff6347" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.p_id.toString()}
        ListEmptyComponent={<Text style={styles.noNotifications}>No notifications</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop:60,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTextContainer: {
    marginLeft: 10,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotifications: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default DoctorNotification;
