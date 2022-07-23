import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  Button,
  Dimensions,
  TextInput,
  List,
  Alert,
} from "react-native";
import { Icon } from "@rneui/themed";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Menu, Provider, Portal, Modal } from "react-native-paper";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";

function RecipeButton(props) {
  const [isPressed, setPressed] = useState(false);
  if (!isPressed) {
    return (
      <TouchableHighlight
        onPress={() => {
          setPressed(!isPressed);
        }}
        style={styles.recipeButtonClosed}
      >
        <View
          style={{
            justifyContent: "space-between",
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Image
            source={require("../assets/image-6.png")}
            style={{
              resizeMode: "contain",
              marginLeft: "-18%",
              marginTop: "3.5%",
              marginRight: "-15%",
              width: "80%",
              height: "80%",
            }}
          />
          <Text style={styles.recipeButtonText}>{props.name}</Text>
        </View>
      </TouchableHighlight>
    );
  } else {
    return (
      <View style={styles.recipeButtonOpen}>
        <TouchableOpacity
          onPress={() => {
            setPressed(!isPressed);
          }}
          style={{
            alignSelf: "flex-end",
            marginRight: "2.5%",
            marginTop: "2.5%",
          }}
        >
          <Icon name={"close"} size={30} color={"black"} />
        </TouchableOpacity>
        <Image
          source={require("../assets/image-9.png")}
          style={{
            resizeMode: "contain",
            alignSelf: "center",
            height: "30%",
            marginTop: "-1.5%",
            marginBottom: "-1.5%",
          }}
        />
        <Text style={styles.recipeName}>{props.name}</Text>
        <Text style={styles.recipeDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          bibendum maximus tortor a ornare. Phasellus mattis orci eu auctor
          molestie. In hac habitasse platea dictumst. Aliquam enim ante, egestas
          dapibus sem at, tristique ullamcorper erat. Suspendisse sollicitudin
          eros sit amet nisl consequat, eu vulputate est viverra. Aenean
          pharetra vulputate libero, sit amet vehicula tortor tempus vel. Sed
          tempor, velit dapibus nam.
        </Text>
      </View>
    );
  }
}

const RecipeScreen = ({ route, navigation }) => {
  let { userID, token } = route.params;

  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [addError, setAddError] = useState("");
  const [search, setSearch] = useState("");
  const [addSearch, setAddSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const closeMenu = () => setMenuVisible(false);
  const openMenu = () => setMenuVisible(true);
  const showAddModal = () => setAddVisible(true);
  const hideAddModal = () => setAddVisible(false);
  const showSearchModal = () => setSearchVisible(true);
  const hideSearchModal = () => setSearchVisible(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  function loadRecipes() {
    setError("");

    const url = "https://pocketpantryapp.herokuapp.com/api/recipe/getRecipes";

    let data = { UserId: userID };

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);

        if (response.status === 200) {
          if (
            response &&
            response.data &&
            response.data.Saved_recipes &&
            response.data.Saved_recipes[0]
          ) {
            console.log(response.data.Saved_recipes);
            setRecipes(response.data.Saved_recipes);
            console.log(recipes[0]);
          } else {
            setError("No Recipes Found");
            console.log(error);
          }
        }
      })
      .catch((error) => {
        setError("Unable to find user by ID " + userID);
        console.log(userID);
        console.log(token);

        console.log(userID._W);
        console.log(token._W);

        console.log(error);
      });
  }

  const searchIngredients = () => {
    setError("");

    const url =
      "https://pocketpantryapp.herokuapp.com/api/recipe/searchRecipeByName";

    let data = { UserId: userID, Name: search };

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);

        if (response.status === 200) {
          if (
            response &&
            response.data &&
            response.data.SearchResults &&
            response.data.SearchResults[0]
          ) {
            console.log(response.data.SearchResults);
            setRecipes(response.data.SearchResults);
          } else {
            setError("No Recipes Found");
            console.log(error);
          }
        }
      })
      .catch((error) => {
        setError("Unable to find user by ID " + userID);
        console.log(userID);
        console.log(token);

        console.log(userID._W);
        console.log(token._W);

        console.log(error);
      });
  };

  const logOut = () => {
    AsyncStorage.removeItem("user_id");
    AsyncStorage.removeItem("token");
    navigation.navigate("LoginScreen", {
      veri: false,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          elevation: 4,
          backgroundColor: "#fefae0",
          marginBottom: 4,
          flexDirection: "row",
          height: Dimensions.get("window").height / 6,
        }}
      >
        <Text
          style={{
            fontFamily: "InriaSans_700Bold",
            fontSize: 48,
            marginLeft: "5%",
            marginTop: "8.5%",
          }}
        >
          Recipes
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "white",
          height: (Dimensions.get("window").height * 2) / 3,
        }}
      >
        {error == "" || error == undefined ? (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return <RecipeButton name={item.Name} />;
            }}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        ) : (
          <Text style={styles.errorTextStyle}>{error}</Text>
        )}
      </View>

      <View
        style={{
          elevation: 4,
          backgroundColor: "#fefae0",
          flexDirection: "row",
          height: Dimensions.get("window").height / 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#92D098",
            height: "45%",
            width: "50%",
            elevation: 4,
            justifyContent: "center",
            borderRadius: 5,
          }}
        >
          <Text style={styles.activeScreenText}>Recipes</Text>
        </View>
        <TouchableHighlight
          style={{
            flexDirection: "row",
            backgroundColor: "#C4EFC8",
            height: "45%",
            width: "50%",
            elevation: 4,
            justifyContent: "center",
            borderRadius: 5,
          }}
          onPress={() =>
            navigation.navigate("ListScreen", {
              userID: userID,
              token: token,
            })
          }
        >
          <View style={{ alignSelf: "center" }}>
            <Text style={styles.otherScreenText}>List</Text>
          </View>
        </TouchableHighlight>
      </View>
      <View
        style={{
          position: "absolute",
          height:
            Platform.OS === "android"
              ? Dimensions.get("window").height + StatusBar.currentHeight
              : "100%",
          width: "100%",
        }}
      >
        <Provider>
          <View>
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity
                  onPress={openMenu}
                  style={{ top: "110%", left: "25%" }}
                >
                  <Icon name={"menu"} size={50} color={"black"} />
                </TouchableOpacity>
              }
              style={{
                position: "absolute",
                left: "47.5%",
                top: "15%",
              }}
            >
              <Menu.Item
                onPress={showAddModal}
                title="Add"
                icon="plus"
                titleStyle={{ fontFamily: "InriaSans_400Regular" }}
              />
              <Menu.Item
                onPress={showSearchModal}
                title="Search"
                icon="magnify"
                titleStyle={{ fontFamily: "InriaSans_400Regular" }}
              />
              <Menu.Item
                onPress={() => {
                  Alert.alert("Action", "Clear All");
                }}
                title="Clear All"
                icon="delete"
                titleStyle={{ fontFamily: "InriaSans_400Regular" }}
              />
              <Menu.Item
                onPress={() => {
                  Alert.alert("Log Out", "Are you sure you want to log out?", [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: logOut,
                    },
                  ]);
                }}
                title="Log Out"
                icon="logout"
                titleStyle={{ fontFamily: "InriaSans_400Regular" }}
              />
            </Menu>
          </View>
        </Provider>
        <Provider>
          <Portal>
            <Modal
              visible={addVisible}
              onDismiss={hideAddModal}
              contentContainerStyle={{
                backgroundColor: "white",
                width: "85%",
                height: "90%",
                alignSelf: "center",
                borderRadius: 10,
                marginTop:
                  Platform.OS === "android" ? -StatusBar.currentHeight : 0,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                <TextInput
                  style={[styles.regularText, styles.searchAddInput]}
                  fontSize={20}
                  placeholder="Search..."
                  onChangeText={(addSearch) => setAddSearch(addSearch)}
                />
                <Icon
                  name={"search"}
                  size={50}
                  color={"black"}
                  style={{ marginTop: "30%" }}
                />
              </View>
              <View style={{ flex: 5 }}></View>
            </Modal>
          </Portal>
        </Provider>
        <Provider>
          <Portal>
            <Modal
              visible={searchVisible}
              onDismiss={hideSearchModal}
              contentContainerStyle={{
                backgroundColor: "#D4D4D4",
                alignSelf: "center",
                borderRadius: 10,
                marginTop:
                  Platform.OS === "android" ? -StatusBar.currentHeight : 0,
                height: 60,
                width: Dimensions.get("window").width * 0.9,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={[styles.regularText, styles.searchInput]}
                  fontSize={20}
                  placeholder="Search..."
                  onChangeText={(search) => setSearch(search)}
                />
                <TouchableOpacity onPress={searchIngredients}>
                  <Icon
                    name={"search"}
                    size={50}
                    color={"black"}
                    style={{ marginLeft: "5%", marginTop: "5%" }}
                  />
                </TouchableOpacity>
              </View>
            </Modal>
          </Portal>
        </Provider>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  recipeButtonClosed: {
    alignSelf: "center",
    borderRadius: 10,
    width: "95%",
    height: "50%",
    backgroundColor: "#FFC08E",
    marginTop: "5%",
    elevation: 4,
  },
  recipeButtonOpen: {
    alignSelf: "center",
    borderRadius: 10,
    width: "95%",
    height: "90%",
    backgroundColor: "#D0ECC7",
    marginTop: "5%",
    elevation: 4,
  },
  recipeButtonText: {
    fontSize: 30,
    marginRight: "18%",
    marginTop: "12.5%",
    fontFamily: "InriaSans_400Regular",
  },
  recipeName: {
    fontSize: 24,
    fontFamily: "InriaSans_700Bold",
    textDecorationLine: "underline",
    marginLeft: "4%",
  },
  recipeDescription: {
    fontSize: 16,
    fontFamily: "InriaSans_700Bold",
    marginLeft: "4%",
    marginRight: "4%",
  },
  activeScreenText: {
    fontSize: 30,
    fontFamily: "InriaSans_700Bold",
    alignSelf: "center",
  },
  otherScreenText: { fontSize: 30, fontFamily: "InriaSans_400Regular" },
  errorTextStyle: {
    color: "black",
    textAlign: "center",
    fontFamily: "InriaSans_700Bold",
    fontSize: 22,
  },
  searchAddInput: {
    height: 60,
    width: "70%",
    alignSelf: "center",
    margin: 12,
    borderWidth: 0,
    padding: 8,
    backgroundColor: "#D4D4D4",
    borderRadius: 9,
  },
  searchInput: {
    height: 60,
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 0,
    padding: 8,
    backgroundColor: "#D4D4D4",
    borderRadius: 9,
  },
  regularText: {
    fontFamily: "InriaSans_400Regular",
  },
});

export default RecipeScreen;
