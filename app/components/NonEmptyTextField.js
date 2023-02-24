import * as React from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

export const NonEmptyTextField = (props) => {
  const onChangeText = (text) => {
    props.setText(text);
    setChanged(true);
  };
  const [changed, setChanged] = React.useState(false);

  const hasErrors = () => {
    return !(props.text.length > 0 || !changed); //shows error only once modified to be empty
  };

  return (
    <View>
      <TextInput
        label={props.label}
        value={props.text}
        onChangeText={onChangeText}
        autoCapitalize={"none"}
      />
      <HelperText type="error" visible={hasErrors()}>
        {props.label} cannot be empty!
      </HelperText>
    </View>
  );
};

// export default UsernameField;
