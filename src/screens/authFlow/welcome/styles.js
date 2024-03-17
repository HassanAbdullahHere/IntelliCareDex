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
    image1: {
        position:"absolute",
        width: 250,
        height: 250,
      },
      image2: {
        position: 'absolute',
        width: 250,
        height: 250,
      },
      image3: {
        position: 'relative',
        width: 65,
        height: 65,
        marginBottom:130
      },
      topMid: {
        top: -45,
        left: "6%",
        marginLeft: -50, 
      },
      littleRightAndBelow: {
        top: 100,
        left: '30%',
      },
      belowMid: {
        top: 202,
        left: -110,
        
      },
      buttonsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: 65,
      },
      TextContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: 75,
        marginBottom:-25
      },
      button: {
        width: '45%',
      },
})