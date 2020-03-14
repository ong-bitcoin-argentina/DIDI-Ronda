import React from "react";
import {View, StyleSheet} from 'react-native';
import {Text, Spinner, Icon} from 'native-base';

import { roundFrequencyArray, dateFormat, amountFormat } from '../../utils';

import colors from '../../components/colors';
import Arrow from '../../../assets/img/arrow.svg';

import CaptionInfo from '../CaptionInfo';
import IconInfo from '../IconInfo';
import Period from './Period';
import ParticipantHList from './ParticipantHList';
import CallToAction from './CallToAction';

const RoundInfo = props => {

    // Props
    const { round, auth, requestNumber } = props;


    // Round info
    const currentShift          = round.shifts.find( shift => shift.status === "current" ) || round.shifts[0]
    const amountPerParticipant  = amountFormat(round.amount / round.shifts.length);
    const shifLimitDate         = dateFormat( currentShift.limitDate )
    const shiftPayStatus        = currentShift.status === "completed" ? "Pagado" : "Impago";
    const startDate             = dateFormat( round.startDate );
    const endDate               = dateFormat( round.endDate );
    const currentNumber         = currentShift.number;
    const totalShifts           = round.shifts.length;
    const userParticipant       = round.participants.find( p => p.user._id === auth.id )

    // Participant info
    const participantNumbers = round.shifts.filter( shift => shift.participant.includes( userParticipant._id )  )

    


    return (
        <View style={ styles.container }>

            <CaptionInfo title="Información">

                <View style={ styles.infoContainer }>
                    <View>
                        <IconInfo icon="calendar-range" title={ shifLimitDate } subtitle="Vencimiento" />
                        <IconInfo icon="cash-usd" title={`$ ${amountPerParticipant}`} subtitle="Aporte" />
                        <IconInfo icon="bell-outline" title={ shiftPayStatus } subtitle="Estado" />
                    </View>

                    <View style={ styles.shiftDetailContainer }>
                        <Text style={ styles.shiftTitle }>Números</Text>
                        <View style={ styles.shiftCircle }>
                            <Text style={ styles.shiftCurrentNumber }>{ currentNumber }</Text>
                            <Text style={ styles.shiftNumbers }>{`${currentNumber} de ${totalShifts}`}</Text>
                        </View>
                    </View>
                </View>

            </CaptionInfo>

            <CaptionInfo title="Cuándo cobro">
            {
                participantNumbers.length > 0 ?
                    participantNumbers.map( 
                        number => (
                            <View style={ styles.payInfo } key={number._id}>
                                <IconInfo icon="bookmark-outline" title={`#${number.number}`} subtitle="Mi Número" />
                                <IconInfo icon="calendar-range" title={ dateFormat( number.limitDate ) } subtitle="Fecha cobro" />
                            </View>
                        )
                    )
                :
                <React.Fragment>
                    <View style={ styles.payInfo }>
                        <IconInfo icon="bookmark-outline" title="#Sin Asignar" subtitle="Mi Número" />
                        <View style={ styles.middleContainer }>
                            <View style={ styles.exclamationIcon }>
                                <Icon type="FontAwesome" name="exclamation" />
                            </View> 
                        </View>
                        <IconInfo icon="calendar-range" title="--/--/--" subtitle="Fecha cobro" />
                    </View>
                    <View style={ styles.buttonContainer  }>
                        <CallToAction title="Seleccionar Número" pressHandler={ () => { requestNumber() } } />
                    </View>
                </React.Fragment>
            }
            </CaptionInfo>


            <CaptionInfo title="Detalle Ronda">
                <View style={ styles.datesContainer }>
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
            </CaptionInfo>

            <CaptionInfo title="Participantes">
                <View style={ styles.participantsContainer }>
                    <ParticipantHList participants={ round.participants } detail={ true } />
                </View>
            </CaptionInfo>
            
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10
    },
    infoContainer: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    shiftDetailContainer: {
        alignItems: 'center'
    },
    shiftTitle: {
        fontSize: 11,
        color: "#333"
    },
    shiftCircle: {
        borderRadius: 2000,
        borderWidth: 15,
        borderColor: colors.secondGray,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 17,
        aspectRatio: 1,
        marginTop: 5
    },
    shiftCurrentNumber: {
        color: colors.mainBlue,
        fontSize: 22,
        fontWeight: 'bold',
    },
    shiftNumbers: {
        fontSize: 10,
        color: "#8a8a8a"
    },
    payInfo: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    datesContainer: {
        flex: 1
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
    participantsContainer: {
        flex: 1
    },
    exclamationIcon: {
        borderRadius: 50,
        width: 35,
        aspectRatio: 1,
        backgroundColor: colors.yellowStatus,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginVertical: 15,
        flex: 1,
        alignItems: 'center',
    }
})

export default RoundInfo;