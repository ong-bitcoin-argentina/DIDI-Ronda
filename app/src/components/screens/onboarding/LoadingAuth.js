import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {View, Spinner} from 'native-base';
import colors from '../../components/colors';
import { getAuth } from '../../utils';

const LoadingAuth = (props) => {

    useEffect( () => {

        const getAuthFromStorage = async () => {
            const auth = await getAuth();

            if( auth )
                props.navigation.navigate('Tuto');
            else
                props.navigation.navigate('Login');
        }

        getAuthFromStorage();

    }, [] );


    return (
        <View style={styles.container}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Spinner color={'white'} />
            </View>
        </View>
    )

}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.mainBlue,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
});

export default LoadingAuth;