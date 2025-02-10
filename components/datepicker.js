import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, Text, View, ViewStyle, ScrollView } from "react-native";

export default function DatePicker(props) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const years = Array.from(new Array(5), (val, index) => new Date().getFullYear() + index);
  const months = Array.from(new Array(12), (val, index) => index + 1);

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const days = Array.from(new Array(daysInMonth), (val, index) => index + 1);

  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showDayPicker, setShowDayPicker] = useState(false)

  const {onCancel, onOk} = props

  const handleCancel = () => {
    onCancel()
  }
  const handleOk = () => {
    const date = new Date(selectedYear, selectedMonth - 1, selectedDay); // Subtract 1 from the month value because JavaScript months are 0-indexed
    onOk(date)
  }
  return (
    <Modal
      animationType="slide"
      visible={true}
      transparent={true}
    >

    <View 
      style={
        {
          justifyContent: "center",
          alignItems: 'center',
          height: "100%",
          width: "100%",
          padding: 16,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }
      }      
    >
      <View style={styles.DatePickerWrapper}>
        <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
          <TouchableOpacity onPress={() => setShowYearPicker(!showYearPicker)} style={styles.Picker}>
            <Text style={{marginBottom: 4, fontWeight: "bold", paddingHorizontal: 4}}>Year</Text>
            <Text style={styles.PickerText}>{selectedYear}</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => setShowMonthPicker(!showMonthPicker)}  style={styles.Picker}>
            <Text style={{marginBottom: 4, fontWeight: "bold", paddingHorizontal: 4}}>Month</Text>
            <Text style={styles.PickerText}>
              {selectedMonth === 1 && ("January")}
              {selectedMonth === 2 && ("February")}
              {selectedMonth === 3 && ("March")}
              {selectedMonth === 4 && ("April")}
              {selectedMonth === 5 && ("May")}
              {selectedMonth === 6 && ("June")}
              {selectedMonth === 7 && ("July")}
              {selectedMonth === 8 && ("August")}
              {selectedMonth === 9 && ("September")}
              {selectedMonth === 10 && ("October")}
              {selectedMonth === 11 && ("November")}
              {selectedMonth === 12 && ("December")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDayPicker(!showDayPicker)} style={styles.Picker}>
            <Text style={{marginBottom: 4, fontWeight: "bold", paddingHorizontal: 4}}>Day</Text>
            <Text style={styles.PickerText}>{selectedDay}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 16}}>
          <TouchableOpacity style={{backgroundColor: "gray", padding: 4, width: 100, borderRadius: 8}} onPress={() => handleCancel()}><Text style={{color: "white", textAlign: "center"}}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: "#4885ed", padding: 4, width: 100, borderRadius: 8}}  onPress={() => handleOk()}><Text style={{color: "white", textAlign: "center"}}>Ok</Text></TouchableOpacity>
        </View>
      </View>
      <View style={{width: "100%", height: 150, marginTop: 10, padding: 8, flexDirection: "row", justifyContent: showDayPicker && showMonthPicker && showYearPicker ? "space-between" : (showDayPicker && showYearPicker ? "space-between" : (showMonthPicker && !showDayPicker && !showYearPicker ? "center" : (showDayPicker && !showMonthPicker && !showYearPicker ? "flex-end" : "flex-start"))), gap: 16}}>
        {
          showYearPicker && (
            <ScrollView
              style={
                {
                  height: 120,
                  borderWidth: 1,
                  borderColor: "gray",
                  maxWidth: "30%",
                  height: 120,
                  zIndex: 999
                }
              }
            >
              {years.map((year, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedYear(year)} style={{backgroundColor: "white", marginBottom: 4, height: 30, alignItems: 'center', justifyContent: 'center',}}>
                  <Text style={{width: "100%", textAlign: "center"}}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )
        }
        {
          showMonthPicker && (
            <ScrollView
              style={
                {
                  height: 120,
                  borderWidth: 1,
                  borderColor: "gray",
                  maxWidth: "30%",
                  height: 120,
                  zIndex: 999
                }
              }
            >
              {months.map((mon, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedMonth(mon)} style={{backgroundColor: "white", marginBottom: 4, height: 30, alignItems: 'center', justifyContent: 'center',}}>
                  <Text style={{width: "100%", textAlign: "center"}}>
                    {mon === 1 && ("January")}
                    {mon === 2 && ("February")}
                    {mon === 3 && ("March")}
                    {mon === 4 && ("April")}
                    {mon === 5 && ("May")}
                    {mon === 6 && ("June")}
                    {mon === 7 && ("July")}
                    {mon === 8 && ("August")}
                    {mon === 9 && ("September")}
                    {mon === 10 && ("October")}
                    {mon === 11 && ("November")}
                    {mon === 12 && ("December")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )
        }
        {
          showDayPicker && (
            <ScrollView
              style={
                {
                  height: 120,
                  borderWidth: 1,
                  borderColor: "gray",
                  maxWidth: "33%",
                  height: 120,
                  zIndex: 999
                }
              }
            >
              {days.map((day, index) => (
                <TouchableOpacity key={index}  onPress={() => setSelectedDay(day)} style={{backgroundColor: "white", marginBottom: 4, height: 30, alignItems: 'center', justifyContent: 'center',}}>
                  <Text style={{width: "100%", textAlign: "center"}}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )
        }
      </View>
    </View>

    </Modal>
  );
}

const styles = StyleSheet.create({
  DatePickerWrapper: {
    width: "100%",
    padding: 16,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#4885ed",
    position: "relative",
    borderRadius: 16,
    justifyContent: "space-between"
  },
  Picker: {
    width: "32%",
  },
  PickerText: {
    borderWidth: 1,
    width: "100%",
    borderRadius: 10,
    padding: 8,
    borderColor: "rgba(0, 0, 0, 0.2)",
    backgroundColor: "rgba(0, 0, 0, 0.05)"
  }
});