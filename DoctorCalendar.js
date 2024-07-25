import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

const DoctorCalendar = () => {
  const [appointments, setAppointments] = useState({});

  useEffect(() => {
    // Fetch appointments from your API or database
    const fetchAppointments = async () => {
      // Example data format
      const data = {
        '2024-07-10': [{ name: 'Appointment 1', time: '10:00 AM' }],
        '2024-07-12': [{ name: 'Appointment 2', time: '1:00 PM' }, { name: 'Appointment 3', time: '3:00 PM' }],
        '2024-07-13': [{ name: 'Appointment 4', time: '11:00 AM' }],
      };
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  const renderItem = (item) => {
    return (
      <View style={styles.appointmentItem}>
        <Text style={styles.appointmentText}>{item.name}</Text>
        <Text style={styles.appointmentTime}>{item.time}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Calendar
          // Initially visible month. Default = Date()
          current={'2024-07-01'}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={'2023-01-01'}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={'2025-12-31'}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {
            console.log('selected day', day);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'yyyy MM'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={(month) => {
            console.log('month changed', month);
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out day from another month that is visible in calendar page. Default = false
          disableMonthChange={true}
          // Enable the option to swipe between months. Default = false
          enableSwipeMonths={true}
          // Render marked dates
          markedDates={appointments}
          // Custom marking styles
          markingType={'multi-dot'}
        />
        {Object.keys(appointments).map((date) => (
          <View key={date} style={styles.dateSection}>
            <Text style={styles.dateHeader}>{date}</Text>
            {appointments[date].map((item, index) => renderItem(item))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:50,
    backgroundColor: '#ffffff',
  },
  dateSection: {
    padding: 10,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  appointmentItem: {
    backgroundColor: '#f9f9f9',
    marginTop:20,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  appointmentText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  appointmentTime: {
    fontSize: 14,
    color: 'gray',
  },
});

export default DoctorCalendar;
