/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect, Fragment } from 'react';
import { PermissionsAndroid, Button, FlatList, TouchableOpacity } from 'react-native';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Text,
} from 'react-native';

import { Header, Colors } from 'react-native/Libraries/NewAppScreen';
import WifiManager from 'react-native-wifi-reborn';

const App = () => {
  const [wifiList, setWifiList] = useState([])
  const [connected, setConnected] = useState({ connected: false, ssid: 'S4N' });
  const [ssid, setSsid] = useState('');
  const password = "tanenbaum-1981";

  const initWifi = async () => {
    try {
      const ssid = await WifiManager.getCurrentWifiSSID();
      setSsid(ssid);
      console.log('Your current connected wifi SSID is ' + ssid);
    } catch (error) {
      setSsid('Cannot get current SSID!' + error.message);
      console.log('Cannot get current SSID!', { error });
    }
  }

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "React Native Wifi Reborn App Permission",
          message:
            "Location permission is required to connect with or scan for Wifi networks. ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        initWifi();
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const connectWithWifi = async ({ SSID, PASSWORD }) => {
    try {
      const data = await WifiManager.connectToProtectedSSID(SSID, PASSWORD, false,);
      console.log('Connected successfully!', { data });
      setConnected({ connected: true, ssid });
    } catch (error) {
      setConnected({ connected: false, error: error.message });
      console.log('Connection failed!', { error });
    }
  };

  const scanExample = async () => {
    try {
      const data = await WifiManager.reScanAndLoadWifiList()
      setWifiList(data)
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    scanExample()
  }, [])


  useEffect(() => {
    requestLocationPermission();
  }, []);


  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={'#FFFFFF'} />
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 15 }}>
        <FlatList
          data={wifiList}
          renderItem={({ item }) => {
            return (
              <Fragment>
                <TouchableOpacity
                  onPress={() => { connectWithWifi({ SSID: item?.SSID, PASSWORD: '001644588' }) }}
                  // activeOpacity={0.70}
                  style={{ padding: 5, borderBottomWidth: 1, borderBottomColor: 'gray', borderStyle: 'solid' }}
                >
                  <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 18, }}>{item?.SSID}</Text>
                  <Text style={{ color: '#000000', fontWeight: '400', fontSize: 16, }}>{item?.SSID}</Text>
                </TouchableOpacity>
              </Fragment>
            )
          }}
          ListEmptyComponent={() => {
            return (
              <Fragment>
                <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>No Data</Text>
                </View>
              </Fragment>
            )
          }}
          keyExtractor={item => item.BSSID}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;