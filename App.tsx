import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants';

const host = "192.168.100.162";
const port = "5000";
interface ScannedCode {
  type: any;
  data: any
};

// Handle HTTP errors since fetch won't.
const handleErrors = (response: any) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const getContentfromDB = (data: any) => {
  const url = `http://${host}:${port}/api/users/${data.id}`;
  return fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "*/*"
    },
    redirect: "follow",
    referrer: "no-referrer"
  })
    .then(handleErrors)
    .then(res => res.json());
}

const activateUserInDB = (data: any) => {
  const url = `http://${host}:${port}/api/users`;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "*/*"
    }
  })
    .then(handleErrors)
    .then(res => res.json());
}

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

  const createActivationAlert = async (res: any) =>
    Alert.alert(
      `QR Scanner`,
      `${res.message}`,
      [
        { 
          text: "Ok", 
          onPress: () => console.log("OK Pressed"),
        }
      ],
      { cancelable: false }
    );

  const createResultsAlert = async (data: any) =>
    Alert.alert(
      `Hey ${data.first_name}!`,
      `User Found! ID: ${data.id}`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { 
          text: "Register", onPress: async () => {
            const response = await activateUserInDB(data);
            createActivationAlert(response);
          }  
        }
      ],
      { cancelable: false }
    );

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: ScannedCode) => {
    setScanned(true);
    const responseArray = await getContentfromDB(JSON.parse(data));
    const registry = responseArray[0];
    registry && registry !== undefined ? createResultsAlert(registry) : alert("User Not Found.");
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});