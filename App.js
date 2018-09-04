import React from "react";
import { View, AsyncStorage, Text, TouchableOpacity, Image, Alert, Platform, ToastAndroid } from "react-native";
import { createStackNavigator } from "react-navigation"; // Version can be specified in package.json
import { Button, Input, Card } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
var Sound = require("react-native-sound");
var SmsAndroid = require("react-native-sms-android");
import { material } from "react-native-typography";

/**
 * map value
 */

const LATITUDE_DELTA = 0.0922;

/**
 *
 */
class Location extends React.Component {
  state = { lat: "", long: "" };
  componentDidMount = async () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });
        this.props.setLatLong({ lat: position.coords.latitude, long: position.coords.longitude });
      },
      error => {
        alert(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000
      }
    );
  };
  render() {
    return this.props.children(this.state);
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Emergency Alert System",
    headerStyle: {
      backgroundColor: "#6B55AC"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          buttonStyle={{
            backgroundColor: "#1abc9c",
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5,
            marginBottom: 12
          }}
          title="CASE:1"
          onPress={() => this.props.navigation.navigate("Case1")}
        />
        <Button
          buttonStyle={{
            backgroundColor: "#3498db",
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5,
            marginBottom: 12
          }}
          title="CASE:2"
          onPress={() => this.props.navigation.navigate("Pattern")}
        />
        <Button
          buttonStyle={{
            backgroundColor: "#6c5ce7",
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5,
            marginBottom: 12
          }}
          title="CASE:3"
          onPress={() => this.props.navigation.navigate("SetPhone")}
        />
        <Button
          buttonStyle={{
            backgroundColor: "#8e44ad",
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5,
            marginBottom: 12
          }}
          title="SET RESCUE PHONE NO"
          onPress={() => this.props.navigation.navigate("SetPhone")}
        />
        <Button
          buttonStyle={{
            backgroundColor: "#2C3A47",
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5,
            marginBottom: 12
          }}
          title="SET PATTERN"
          onPress={() => this.props.navigation.navigate("SetPattern")}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
        <Button
          buttonStyle={{
            backgroundColor: "#DA3749",
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
          title="Go to Details... again"
          onPress={() => this.props.navigation.push("Details")}
        />
        <Button
          buttonStyle={{
            backgroundColor: "#DA3749",
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
          title="Go to Home"
          onPress={() => this.props.navigation.navigate("Home")}
        />
        <Button
          buttonStyle={{
            backgroundColor: "#DA3749",
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}
class SetPhoneScreen extends React.Component {
  static navigationOptions = {
    title: "Set Rescue Phone Number",
    headerStyle: {
      backgroundColor: "#6B55AC"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  state = {
    phone: ""
  };
  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem("phoneNumber");
      if (value !== null) {
        this.setState({
          phone: value
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  setPhone = text => {
    this.setState({ phone: text });
  };
  onSave = () => {
    AsyncStorage.setItem("phoneNumber", this.state.phone, () => {
      alert("Phone number succcessfully added");
      this.props.navigation.goBack();
    });
  };
  render = () => {
    console.log(AsyncStorage.getItem("phoneNumber"), this.state);
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Input
            value={this.state.phone}
            defaultValue={this.state.phone}
            onChangeText={this.setPhone}
            keybordType="phone-pad"
            placeholder="Phone number"
            leftIcon={<Icon name="phone" size={24} color="black" />}
          />
          {this.state.phone.length ? (
            <Button
              title="SAVE"
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
                width: 100,
                height: 45,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
              }}
              containerStyle={{ marginTop: 20 }}
              onPress={this.onSave}
            />
          ) : null}
        </View>
      </View>
    );
  };
}

class PatternScreen extends React.Component {
  static navigationOptions = {
    title: "Case 2",
    headerStyle: {
      backgroundColor: "#6B55AC"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  state = { countDown: 10, numberOfClick: 0, click: 0 };

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem("numberOfClick");
      if (value !== null) {
        this.setState({ numberOfClick: parseInt(value) });
      }
    } catch (error) {
      console.log(error);
    }
    this.timer = setInterval(
      () =>
        this.setState(
          {
            countDown: this.state.countDown - 1
          },
          async () => {
            if (this.state.countDown === 0) {
              this.sendMessage();
              clearInterval(this.timer);
            }
          }
        ),
      1000
    );
  };
  componentWillUnmount = () => {
    clearInterval(this.timer);
  };

  sendMessage = async () => {
    console.warn(
      `In danger , location : ${this.state.lat},${this.state.long} , time: ${new Date()}` // sms body
    );
    try {
      const value = await AsyncStorage.getItem("phoneNumber");
      if (value !== null) {
        SmsAndroid.sms(
          value, // phone number to send sms to
          `In danger , location : ${this.state.lat},${this.state.long} , time: ${new Date()}`, // sms body
          "sendDirect", // sendDirect or sendIndirect
          (err, message) => {
            if (err) {
              alert("Failed to send message");
            } else {
              alert("Successfully send message"); // callback message
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  onClickPattern = () => {
    if (this.state.click <= this.state.numberOfClick)
      this.setState(
        {
          click: this.state.click + 1
        },
        () => {
          if (this.state.click === this.state.numberOfClick) {
            clearInterval(this.timer);
          }
        }
      );
  };
  render() {
    return (
      <View style={{ flexGrow: 1, backgroundColor: "white" }}>
        <Location setLatLong={({ lat, long }) => this.setState({ lat, long })}>
          {({ lat, long }) => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 40, textAlign: "center" }}>Countdown : {this.state.countDown + ""}</Text>
                <Text style={[material.subheading, { marginBottom: 7, color: "grey" }]}>
                  {lat} , {long}
                </Text>
                <Text style={[material.subheading, { marginBottom: 7, color: "grey" }]}>
                  Provide your pattern to diactivate
                </Text>

                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: "black",
                    justifyContent: "center",
                    alignItems: "center",

                    backgroundColor: "#2ecc71",
                    ...Platform.select({
                      android: {
                        elevation: 4
                      }
                    })
                  }}
                  onPress={() => this.onClickPattern({ lat, long })}
                >
                  <Image style={{ width: 50, height: 50 }} source={require("../rescue/assets/images/fingure.png")} />
                </TouchableOpacity>
              </View>
            );
          }}
        </Location>
      </View>
    );
  }
}

class SetPatternScreen extends React.Component {
  static navigationOptions = {
    title: "Set Your Pattern",
    headerStyle: {
      backgroundColor: "#6B55AC"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  state = { numberOfClick: 0 };
  onSetPattern = () => {
    this.setState({
      numberOfClick: this.state.numberOfClick + 1
    });
  };
  onSave = () => {
    if (this.state.numberOfClick > 1) {
      AsyncStorage.setItem("numberOfClick", this.state.numberOfClick + "", () => {
        Alert.alert(
          "Success",
          "Pattern save successfully",
          [
            {
              text: "OK",
              onPress: () => {
                this.props.navigation.goBack();
              }
            }
          ],
          { cancelable: false }
        );
      });
    }
  };
  render() {
    return (
      <View
        style={{
          flexGrow: 1,
          backgroundColor: "white"
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={[material.display2, { paddingBottom: 10, paddingTop: 10 }]}>
            {this.state.numberOfClick + ""}
          </Text>
          <Text style={[material.subheading, { marginBottom: 7, color: "grey" }]}>
            Tab the below button to set pattern
          </Text>

          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",

              backgroundColor: "#2ecc71",
              ...Platform.select({
                android: {
                  elevation: 4
                }
              })
            }}
            onPress={this.onSetPattern}
          >
            <Image style={{ width: 50, height: 50 }} source={require("../rescue/assets/images/fingure.png")} />
          </TouchableOpacity>
          {this.state.numberOfClick > 1 && (
            <Button
              onPress={this.onSave}
              title="SAVE"
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
                width: 100,
                height: 45,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
              }}
              containerStyle={{ marginTop: 20 }}
            />
          )}
        </View>
      </View>
    );
  }
}
class Case1Screen extends React.Component {
  static navigationOptions = {
    title: "Case 1",
    headerStyle: {
      backgroundColor: "#6B55AC"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  state = { numberOfClick: 0, click: 0 };
  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem("numberOfClick");
      if (value !== null) {
        this.setState({ numberOfClick: parseInt(value) });
      }
    } catch (error) {
      console.log(error);
    }
  };
  sendMessage = async ({ lat, long }) => {
    console.warn(`In danger , location : ${lat},${long} , time: ${new Date()}`);
    try {
      const value = await AsyncStorage.getItem("phoneNumber");
      if (value !== null) {
        SmsAndroid.sms(
          value, // phone number to send sms to
          `In danger , location : ${lat},${long} , time: ${new Date()}`, // sms body

          "sendDirect", // sendDirect or sendIndirect
          (err, message) => {
            if (err) {
              alert("Failed to send message");
            } else {
              alert("Successfully send message"); // callback message
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  onClickPattern = ({ lat, long }) => {
    if (this.state.click <= this.state.numberOfClick)
      this.setState(
        {
          click: this.state.click + 1
        },
        () => {
          if (this.state.click === this.state.numberOfClick) {
            this.sendMessage({ lat, long });
            this.setState({ click: 0 });
          }
        }
      );
  };
  render() {
    console.log(this.state);
    return (
      <View
        style={{
          flexGrow: 1,
          backgroundColor: "white"
        }}
      >
        <Card title="CASE STATUS">
          <Text style={[material.body2, { textAlign: "center", padding: 10 }]}>
            <FontAwesome name="user-check" size={20} style={{ padding: 100 }} color="green" /> -> USER AVALIABLE
          </Text>
          <Text style={[material.body2, { textAlign: "center", padding: 10 }]}>
            <FontAwesome name="mobile-alt" size={20} style={{ padding: 100 }} color="green" /> -> DEVICE AVALIABLE
          </Text>
        </Card>
        <View
          style={{
            flex: 1,
            paddingTop: 50,
            alignItems: "center"
          }}
        >
          <Text style={[material.subheading, { marginBottom: 7, color: "grey" }]}>
            Tab the below button to send alert
          </Text>
          <Location setLatLong={({ lat, long }) => {}}>
            {({ lat, long }) => (
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "black",
                  justifyContent: "center",
                  alignItems: "center",

                  backgroundColor: "#2ecc71",
                  ...Platform.select({
                    android: {
                      elevation: 4
                    }
                  })
                }}
                onPress={() => this.onClickPattern({ lat, long })}
              >
                <Image style={{ width: 50, height: 50 }} source={require("../rescue/assets/images/fingure.png")} />
              </TouchableOpacity>
            )}
          </Location>
        </View>
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Details: {
      screen: DetailsScreen
    },
    SetPhone: {
      screen: SetPhoneScreen
    },
    Pattern: {
      screen: PatternScreen
    },
    SetPattern: {
      screen: SetPatternScreen
    },
    Case1: {
      screen: Case1Screen
    }
  },
  {
    initialRouteName: "Home"
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
