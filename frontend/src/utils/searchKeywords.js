export const searchKeyword = (object, message) => {
    console.log(object)
    message = message.toLowerCase();

    // Iterate over each key in the object
    for (let key in object) {
      // Get the value for this key, which should be an array of topics
      let value = object[key];

      // Check if the value is an array
      if (Array.isArray(value)) {
        // If it is an array, iterate over each topic in the array
        for (let topic of value) {
          // Convert the topic to lower case for case-insensitive comparisons
          topic = topic.toLowerCase();

          // Check if the message contains the current topic
          if (message.includes(topic)) {
            // If so, return an object indicating that the topic was found and the key it was found under
            return { found: true, key: key };
          }
        }
      } else if (typeof value === "string") {
        // If the value is a string, convert it to lower case for case-insensitive comparisons
        let topic = value.toLowerCase();

        // Check if the message contains the current topic
        if (message.includes(topic)) {
          // If so, return an object indicating that the topic was found and the key it was found under
          return { found: true, key: key };
        }
      }
    }

    // If no matching topic was found, return an object indicating that no topic was found
    return { found: false, key: null };
};

