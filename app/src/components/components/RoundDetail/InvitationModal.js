import React, { useEffect } from "react";
import { View, StyleSheet } from 'react-native';
import {Text, Icon, Toast} from 'native-base';
import * as roundsActions from '../../../actions/rounds';
import {connect} from 'react-redux';

import { roundFrequencyArray, dateFormat, amountFormat } from '../../utils';
import colors from '../colors';

import Arrow from '../../../assets/img/arrow.svg';
import RoundPopUp from '../../components/RoundPopUp';
import Avatar from '../Avatar';
import IconInfo from '../IconInfo';

const InvitationModal = props => {

    // Props
    const { navigation, round, auth, invitation, accept_invitation, reject_invitation, invitation_clean } = props;

    const admin                 = round.participants.find( p => p.user.id === round.admin );

    const adminPicture          = admin && admin.user.picture;
    const adminName             = admin && admin.user.name;
    const adminPhone            = admin && admin.user.phone;
    const title                 = `${adminName} te invitó a participar de una ronda.`;
    const startDate             = dateFormat( round.startDate );
    const endDate               = dateFormat( round.endDate );
    const amountPerParticipant  = amountFormat(round.amount / round.shifts.length);
    const amount                = amountFormat( round.amount );
    const totalShifts           = round.shifts.length;
    const userParticipant       = round.participants.find( p => p.user._id === auth.id )

    // Mount
    useEffect(() => {
        this.child._openPopUp();
    }, []);
    
    // Update invitation
    useEffect(() => {

        if( !invitation.loading ){

            if( invitation.error !== null && invitation.round === null ){
                invitation_clean();
                navigation.navigate('List');
                Toast.show({
                    text: "Hubo un error, intente nuevamente",
                    buttonText: 'Okay',
                });
            }

            if( invitation.error === null && invitation.round !== null ){
                // Close modal and magic happens
                this.child._closePopUp();
            }
        }

    }, [invitation]);


    // Methods
    _acceptInvitation = () => {
        accept_invitation( userParticipant._id, round._id )
    }

    _rejectInvitation = () => {
        reject_invitation( userParticipant._id, round._id )
        navigation.navigate('List');
    }

    return (
        <RoundPopUp
            onRef={ref => (this.child = ref)}
            titleText={ title }
            accept={ () => { _acceptInvitation() }  }
            positive={ () => { _acceptInvitation() } }
            negative={ () => { _rejectInvitation() }  } 
            acceptTitle="Aceptar"
            positiveTitle="Aceptar y Solicitar Número" 
            negativeTitle="Rechazar"
            notCloseAfterPositive={ true }
            notCloseAfterNegative={ true }
        >
        
            <View style={ styles.container }>

                <View style={ styles.avatarContainer }>
                    <Avatar path={ adminPicture } size={100} />
                    <Text style={ styles.textName }>{ adminName }</Text>
                    <Text style={ styles.textPhone }>{ adminPhone }</Text>
                </View>

                <View style={ styles.detailContainer }>
                    
                    <View style={ styles.iconContainer }>
                        <View style={ styles.iconCircle }>
                            <Icon
                                type="MaterialIcons"
                                name="filter-tilt-shift"
                                style={{color:'white'}}
                            />
                        </View>
                    </View>
                    <View style={ styles.datesContainer }>
                    
                        <View style={ styles.titleContainer }>
                            <View style={ styles.datesRow }>
                                <Text style={ styles.detailNameText }>{ round.name }</Text>
                                <Text style={ styles.detailAmountText }>{`$ ${amount}`}</Text>
                            </View>
                            <View style={ styles.detailBookmarkContainer }>
                                <Icon
                                    type="MaterialIcons"
                                    name="bookmark-border"
                                    style={ styles.detailBookmarkIcon }
                                />
                                <Text style={ styles.detailBookmarkText }> {`0 de ${totalShifts}`}</Text>
                            </View>
                        </View>

                        <View style={ styles.datesRow }>
                            <IconInfo icon="calendar-range" title={ startDate } subtitle="Inicio" />
                            <View style={ styles.middleContainer }>
                                <Arrow height={12} width="100%" />
                            </View>
                            <IconInfo icon="calendar-range" title={ endDate } subtitle="Fin" />
                        </View>
                        
                        <View style={ styles.datesRow }>
                            <IconInfo icon="alarm" title={ roundFrequencyArray[ round.recurrence ] } subtitle="Frecuencia" />
                            <IconInfo icon="cash-usd" title={`$ ${amountPerParticipant}`} subtitle="Aporte" />
                        </View>

                    </View>


                </View>

            </View>

        </RoundPopUp>
    )

}

const styles = StyleSheet.create({
    container:{
        width: "100%"
    },
    avatarContainer: {
        alignItems: 'center',
        backgroundColor: 'white'
    },
    textName: {
        fontSize: 16,
        color: colors.mainBlue,
        fontWeight: 'bold',
    },
    textPhone: {
        fontSize: 12,
        color: colors.gray
    },
    detailContainer: {
        marginTop: 10,
        padding: 20,
        backgroundColor: colors.backgroundGray,
        flexDirection: 'row',
    },
    iconContainer: {
        paddingRight: 15,
    },
    iconCircle: {
        backgroundColor: colors.mainBlue,
        borderRadius: 100,
        padding: 5,
    },
    titleContainer: {
        marginBottom: 10
    },
    detailNameText: {
        fontWeight: 'bold',
        color: "#333",
    },
    detailAmountText: {
        textAlign: 'right',
        color: colors.mainBlue,
        fontWeight: 'bold',
    },
    detailBookmarkContainer: {
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center'
    },
    detailBookmarkIcon: {
        color: colors.mainBlue, 
        fontSize: 22,
    },
    detailBookmarkText: {
        fontSize: 12,
    },
    datesContainer: {
        flexGrow: 1,
    },
    datesRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    middleContainer: {
        flexGrow: 1,
        alignItems: 'center'
    },
});

const mapStateToProps = state => {
    return {
        invitation: state.participant.invitation,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        accept_invitation: ( idParticipant, roundId ) => {
            dispatch( roundsActions.acceptInvitation( idParticipant, roundId ) );
        },
        reject_invitation: ( idParticipant, roundId ) => {
            dispatch( roundsActions.rejectInvitation( idParticipant, roundId ) );
        },
        invitation_clean: () => {
            dispatch( roundsActions.invitationClean() );
        },
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(InvitationModal);