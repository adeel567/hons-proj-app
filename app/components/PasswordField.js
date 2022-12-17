import * as React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

export const PasswordField = (props) => {

    const onChangeText = text => {
        props.setPassword(text)
        setChanged(true)};
    const [changed, setChanged] = React.useState(false);
    const [hidden, setHidden] = React.useState(true);
    const [icon, setIcon] = React.useState("eye-off-outline")
    const toggleHidden = () => {
        setHidden(!hidden)
        hidden ? setIcon("eye-off-outline") : setIcon("eye-outline")
    };

    const hasErrors = () => {
        return !(props.password.length > 0 || !changed ); //shows error only once modified to be empty
    };

    return (
        <View>
        <TextInput label={props.label} secureTextEntry={hidden} onChangeText={onChangeText} right={<TextInput.Icon
                                                                                            name={icon}
                                                                                            onPress={toggleHidden}
                                                                                            />}/>
                                                                    
                                                                    
        <HelperText type="error" visible={hasErrors()}>
            Password cannot be empty!
        </HelperText>
        </View>
    );
};

PasswordField.defaultProps = {
    label: "Password"
}

