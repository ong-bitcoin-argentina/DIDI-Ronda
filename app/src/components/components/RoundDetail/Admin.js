import React from 'react';
import Period from './Period';

const Participant = props => {

    const { round } = props;


    return (
        <Period 
            startDate={ round.startDate }
            endDate={ round.endDate }
        />
    )
}


export default Participant;