import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, Button } from "native-base";
import { createStackNavigator } from 'react-navigation-stack';
import { getAuth } from '../../../utils/utils';
import { openAidiCredentials } from "../../../utils/appRouter";

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      user: undefined
    };
  }

  static navigationOptions = {
    tabBarOptions: {
      showLabel: true,
    },
  };

  async componentDidMount(){
    const user = await getAuth();
    this.setState({ user: user });
    console.log("user componentDidMount",user);
  }

  roundsType = () => {
    return [
      { title: "Todas mis Rondas", qty: "10", icon: "", color:"#04C9E1"},
      { title: " Rondas completadas", qty: "6", icon: "", color:"#906ECD"},
      { title: " Rondas en curso", qty: "4", icon: "", color:"#6ECC62"}
    ]
  }

  renderCard = (round) => {
    return (
      <View style={{backgroundColor: round.color, ...styles.card}}>
        <View style={{flex: 1, flexDirection: "row", alignContent:"center"}}>
          <Icon
            type="MaterialIcons"
            name="filter-tilt-shift"
            style={{color:"white"}}
          />
          <Text style={{color:"white", fontSize:18}} > {round.title} </Text>
        </View>
        <Text style={{fontSize:30, color:"white", fontWeight: "bold"}}> {round.qty} </Text>
      </View>
    )
  }

  goToCredentials = () => openAidiCredentials();

  seeCredentials = () => {
    const { user } = this.state;
    console.log("seeCredentials", user);
    return (
      <View style={{backgroundColor: "#FFFFFF", padding:15, marginTop: 10}}>
        <View style={{flexDirection: "row", justifyContent: "center"}}>
          <Icon
            type="MaterialCommunityIcons"
            name="certificate"
            style={{color:"#24CDD2"}}
          />
          <View style={{paddingLeft: 10}}>
            <Text style={{color:"#24CDD2", fontSize: 16, fontWeight: "bold"}}> { user ? user.nick : "FLOR" }  </Text>
            <Text style={{color:"#24CDD2"}}> Accede a todas tus credenciales de Ronda en ai-di </Text>
          </View>
        </View>
        <View style={{flexDirection: "row", justifyContent: "center"}}>
          <Button style={styles.button} onPress={this.goToCredentials}> 
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}> Ver Credenciales </Text>
          </Button>
        </View>
      </View>
    )
  }

  render() {
    const roundsType = this.roundsType();
    const title = "Resumen de Actividad";
    return (
      <View style={{flexDirection: 'column', flex: 1, padding:10, backgroundColor: "#E5E5E5"}}>
        <Text style={{fontSize:25, marginBottom: 10}}> { title } </Text>
        {roundsType.map(round => this.renderCard(round))}
        {this.seeCredentials()}  
      </View>);
  }
}

const styles = StyleSheet.create({
  card:{
    borderRadius: 10, 
    flex: 1, 
    flexDirection: "row",
    marginBottom: 10, 
    padding: 5, 
    justifyContent: "space-between", 
    alignContent:"center",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#24CDD2",
    borderRadius: 8,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: () => ({
      title: `Mis Rondas`,
      headerStyle: {backgroundColor: '#417fd7'},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
    }),
  },
});
