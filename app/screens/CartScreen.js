import React, { useContext } from 'react';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../api';
import { Alert } from 'react-native';
import { AddToCartButton } from '../components/AddToCartButton';
import { RemoveFromCartButton } from '../components/RemoveFromCartButton';
import { EmptyCartButton } from '../components/EmptyCartButton';

export const CartScreen = () => {

    return (
        <SafeAreaView>
            <RemoveFromCartButton id={69}>Remove</RemoveFromCartButton>
            <EmptyCartButton>Empty</EmptyCartButton>
        </SafeAreaView>
    )
}