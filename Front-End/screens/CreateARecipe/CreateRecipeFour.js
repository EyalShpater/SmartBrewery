import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./CreateRecipe.style";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../constants";
import axios from "axios";

const CreateRecipeFour = () => {
  let navigation = useNavigation();
  const route = useRoute();

  const [notifications, setNotifications] = useState([
    {
      message: "",
      send_after_days: 0,
    },
  ]);

  const {
    userId,
    recipeName,
    method,
    style,
    abv,
    ibu,
    originalGravity,
    finalGravity,
    color,
    batchSizeLiter,
    fermentableDetails,
    hopsDetails,
    yeastDetails,
    steps,
  } = route.params;

  const renderNotifications = () => {
    return notifications.map((notification, index) => (
      <View key={index} style={styles.stepContainer}>
        <Text style={[styles.instructions, { marginBottom: 20 }]}>
          Message {index + 1}:
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message:</Text>
          <TextInput
            style={styles.input}
            value={notification.message}
            onChangeText={(text) => handleInputChange(index, "message", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Number of days to sent after:</Text>
          <TextInput
            style={styles.input}
            value={notification.send_after_days}
            onChangeText={(text) =>
              handleInputChange(index, "send_after_days", parseFloat(text))
            }
          />
        </View>
      </View>
    ));
  };

  const handleAddNotification = () => {
    setNotifications([...notifications, { message: "", send_after_days: 0 }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index][field] = value;
    setNotifications(updatedNotifications);
  };

  const handleSubmit = async () => {
    const recipe = {
      user_id: route.params.userId,
      recipe_name: route.params.recipeName,
      method: route.params.method,
      style: route.params.style,
      abv: parseFloat(route.params.abv),
      ibu: parseFloat(route.params.ibu),
      original_gravity: parseFloat(route.params.originalGravity),
      final_gravity: parseFloat(route.params.finalGravity),
      color: parseFloat(route.params.color),
      batch_size_liter: parseFloat(route.params.batchSizeLiter),
      recipe: route.params.step,
      notifications: notifications,
      fermentables: route.params.fermentableDetails,
      hops: route.params.hopsDetails,
      yeast: route.params.yeastDetails,
    };

    const url = "https://brewtothefuture.azurewebsites.net/api/brew/recipe";

    (async () => {
      try {
        const response = await axios.post(url, recipe, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          console.log("Recipe created successfully!");
          console.log(response.data);
        } else {
          console.error(`Error: ${response.status}`);
          console.error(response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  };

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.backGround }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.instructions, { marginBottom: 10 }]}>
          Add message for the fermentation process:
        </Text>
        {renderNotifications()}
        <TouchableOpacity
          onPress={handleAddNotification}
          style={styles.AddStepButton}
        >
          <Text style={styles.AddStepButtonText}>
            +Add fermentation message
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <View style={{ marginVertical: 50 }} />
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.nextPageButton}
        >
          <Text style={styles.nextPageButtonText}>Save Recipe</Text>
        </TouchableOpacity>

        {/* Back To Main Screen */}
        <TouchableOpacity
          onPress={() => handleNavigation("Welcome")}
          style={styles.nextPageButton}
        >
          <Text style={styles.nextPageButtonText}>Back To Main Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRecipeFour;