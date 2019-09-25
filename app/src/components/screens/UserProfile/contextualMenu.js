import React from 'react';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {
  Icon,
  View,
  Text,
} from 'native-base';
import colors from '../../components/colors';

export default ContextualMenu = () => {
  return (
    <Menu>
      <MenuTrigger>
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      </MenuTrigger>
      <MenuOptions style={{padding: 10}}>
        <MenuOption onSelect={() => alert(`Compartido!`)}>
          <Text style={{fontSize: 16, color: colors.gray}}>
            Compartir Puesto
          </Text>
        </MenuOption>
        <MenuOption onSelect={() => alert(`Documentos`)}>
          <Text style={{fontSize: 16, color: colors.gray}}>Reemplazar</Text>
        </MenuOption>
        <MenuOption onSelect={() => alert(`Documentos`)}>
          <Text style={{fontSize: 16, color: colors.gray}}>Enviar Mensaje</Text>
        </MenuOption>
        <MenuOption onSelect={() => alert(`Documentos`)}>
          <Text style={{fontSize: 16, color: colors.gray}}>
            Pagarle al Usuario
          </Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};
