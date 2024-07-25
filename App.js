import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorLogin from './doctorlogin';
import DoctorSignUp from './DoctorSignUp';
import RoleSelectionScreen from './select';
import PatientLogin from './patientlogin';
import DoctorDashboard from './d_homescreen'; 
import PatientDashboard from './p_dashboard';
import AddPatientDetails from './addpatientdetails';
import PatientSearch from './search';
import EditPatientDetailsScreen from './edit';
import DischargeSummary from './dischargesummary';
import Medication from './medication';
import PDischargeSummary from './p_discharge';
import FollowUp from './followup';
import DailyAssessment from './dailyassess';
import QuestionScreen from './d_questions';
import Pqns from './p_qns';
import PrescriptionScreen from './Prescription';
import Summary from './summary';
import DailyAssessResponses from './dailyassess_responses';
import AssessmentDetail from './AssessmentDetail';
import PatientMedication from './PatientMedication';
import MedicationDetails from './PatientMedicationDetails';
import PatientDischargeSummary from './PatientDischargeSummary';
import SummaryDetails from './SummaryDetails';
import PatientNotes from './Patient_Notes';
import PatientNoteDetails from './PatientNotesDetail';
import DoctorPatientNotes from './DoctorPatientNotes';
import DoctorPatientNotesDetails from './DoctorPatientNotesDetails';
import DoctorCalendar from './DoctorCalendar';
import DoctorNotification from './DoctorNotification';
import DietInfo from './DietInfo';
import ProfileScreen from './profile';
import DoctorProfile from './doctorprofile';
import QuestionnaireResponses from './questionnaireresponses';

//import GetStarted from './getstart';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoleSelectionScreen">
      <Stack.Screen name="RoleSelectionScreen" component={RoleSelectionScreen}  options={{ headerShown: false }} />
      <Stack.Screen name="DoctorSignUp" component={DoctorSignUp} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorLogin" component={DoctorLogin} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientLogin" component={PatientLogin} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientDashboard" component={PatientDashboard} options={{ headerShown: false }}/>
        <Stack.Screen name="AddPatientDetails" component={AddPatientDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientSearch" component={PatientSearch} options={{ headerShown: false }}/>
        <Stack.Screen name="EditPatientDetailsScreen" component={EditPatientDetailsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DischargeSummary" component={DischargeSummary} options={{ headerShown: false }}/>
        <Stack.Screen name="Medication" component={Medication} options={{ headerShown: false }}/>
        <Stack.Screen name="PDischargeSummary" component={PDischargeSummary} options={{ headerShown: false }}/>
        <Stack.Screen name="FollowUp" component={FollowUp} options={{ headerShown: false }}/>
        <Stack.Screen name="DailyAssessment" component={DailyAssessment} options={{ headerShown: false }}/>
        <Stack.Screen name="QuestionScreen" component={QuestionScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Pqns" component={Pqns} options={{ headerShown: false }}/>
        <Stack.Screen name="PrescriptionScreen" component={PrescriptionScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Summary" component={Summary} options={{ headerShown: false }}/>
        <Stack.Screen name="DailyAssessResponses" component={DailyAssessResponses} options={{ headerShown: false }}/>
        <Stack.Screen name="AssessmentDetail" component={AssessmentDetail} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientMedication" component={PatientMedication} options={{ headerShown: false }}/>
        <Stack.Screen name="MedicationDetails" component={MedicationDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientDischargeSummary" component={PatientDischargeSummary} options={{ headerShown: false }}/>
        <Stack.Screen name="SummaryDetails" component={SummaryDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientNotes" component={PatientNotes} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientNoteDetails" component={PatientNoteDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorPatientNotes" component={DoctorPatientNotes} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorPatientNotesDetails" component={DoctorPatientNotesDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorCalendar" component={DoctorCalendar} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorNotification" component={DoctorNotification} options={{ headerShown: false }}/>
        <Stack.Screen name="DietInfo" component={DietInfo} options={{ headerShown: false }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorProfile" component={DoctorProfile} options={{ headerShown: false }}/>
        <Stack.Screen name="QuestionnaireResponses" component={QuestionnaireResponses} options={{ headerShown: false }}/>





        




        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
