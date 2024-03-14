import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeDataToStorage = async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value))
}

export const removeDataFromStorage = async (key) => {
    await AsyncStorage.removeItem(key)
}

export const getDataFromStorage = async (value) => {
    let data = await AsyncStorage.getItem(value)
    let newData = JSON.parse(data)
    return newData
}