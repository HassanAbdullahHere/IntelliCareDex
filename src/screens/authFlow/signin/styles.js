import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      card: {
        width: '95%',
        borderRadius: 10,
        padding: 20,
        
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 6,
      }, resetPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: -15,
        marginBottom:10
      },
      resetPasswordText: {
        color: "black",
        fontSize: 14,
        textDecorationLine: 'underline',
      },
      logo: {
        width: 160,
        height: 160,
        marginBottom: 20,
        alignSelf: 'center',
      },
      input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
      },
      button: {
        width: '100%',
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }, passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
      },
      eyeIconImage: {
        width: 20,
        height: 20,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      text: {
        fontSize: 16,
      },
      BottomText:{
        flexDirection:"row"
      }
})