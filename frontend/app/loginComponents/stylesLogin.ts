import { StyleSheet } from 'react-native';

const styles1 = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#fff',
    },
    inputBox: {
      borderWidth: 1,
      borderColor: '#000',
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    inputText: {
      fontSize: 16,
      color: '#000',
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
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 12,
      },
      loginButton: {
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
      },
      loginButtonText: {
        color: '#fff',
        fontWeight: '600',
      },
  });

  export default styles1;