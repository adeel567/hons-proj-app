import * as React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

export const UsernameField = (props) => {

    const onChangeText = text => {
        props.setUsername(text)
        setChanged(true)};
    const [changed, setChanged] = React.useState(false)

    const hasErrors = () => {
        return !(props.username.length > 0 || !changed ); //shows error only once modified to be empty
    };

    return (
        <View>
        <TextInput label="Username" value={props.username} onChangeText={onChangeText} autoCapitalize={"none"} />
        <HelperText type="error" visible={hasErrors()}>
            Email address cannot be empty!
        </HelperText>
        </View>
    );
};

// export default UsernameField;