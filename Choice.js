import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChoiceProps, styles } from "./dailyassess";

export const Choice: React.FC<ChoiceProps> = ({ label, onPressYes, onPressNo }) => (
    <View style={styles.choiceContainer}>
        <Text style={styles.choiceText}>{label}</Text>
        <View style={styles.choiceButtons}>
            <TouchableOpacity style={styles.choiceButton} onPress={onPressYes}>
                <Text>Yes</Text>
            </TouchableOpacity>
            <View style={styles.choiceIndicator} />
            <TouchableOpacity style={styles.choiceButton} onPress={onPressNo}>
                <Text>No</Text>
            </TouchableOpacity>
        </View>
    </View>
);
