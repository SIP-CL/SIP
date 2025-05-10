import {useState} from 'react';
import { Text, View, TextInput, Button, StyleSheet } from "react-native";
import { auth } from '../../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth'



export default function FeedScreen() {
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('');
 const [errorMsg, setErrorMsg] = useState('');


const handleLogin = async () => {
 try {
   const userCredential = await signInWithEmailAndPassword(auth, email, password);
   console.log('logged in as:', userCredential.user.email);
 } catch (error: any) {
   setErrorMsg(error.message);
 }
};


return (
 <View style={styles.container}>
   <TextInput
     placeholder="Email"
     value={email}
     onChangeText={setEmail}
     autoCapitalize="none"
     style={styles.input}
   />
   <TextInput
     placeholder="Password"
     value={password}
     onChangeText={setPassword}
     secureTextEntry
     style={styles.input}
   />
   {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
   <Button title="Login" onPress={handleLogin} />
 </View>
);
}


const styles = StyleSheet.create({
container: {
 flex: 1,
 justifyContent: 'center',
 paddingHorizontal: 30,
},
input: {
 borderBottomWidth: 1,
 marginBottom: 16,
 padding: 8,
},
error: {
 color: 'red',
 marginBottom: 10,
},

link: {
  marginTop: 16,
  color: 'blue',
  textAlign: 'center',
},

});


