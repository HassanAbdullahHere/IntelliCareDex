import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    padding: 20,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4EB7D9',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  cameraText: {
    
    fontSize: 16,
    marginRight: 10,
  },
  imageList: {
    marginTop: 20,
  },
  imageContainer: {
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraName: {
    color: '#fff',
    marginLeft: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
});
