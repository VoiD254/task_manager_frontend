import AsyncStorage from "@react-native-async-storage/async-storage";

const storeItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("storeItem error", key, err);
  }
};

const getItem = async (key) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch (err) {
    console.error("getItem error", key, err);
    return null;
  }
};

const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error("removeItem error", key, err);
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    console.error("clearAll error", err);
  }
};

export {
    clearAll, getItem,
    removeItem, storeItem
};

