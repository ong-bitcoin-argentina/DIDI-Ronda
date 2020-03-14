import React from 'react';
import Admin from './Admin';
import Participant from './Participant';

const CreatedRound = props => {

    const { round, auth } = props;

    const userIsAdmin = round.admin === auth.id;

    return (
        userIsAdmin ?
        <Admin {...props} /> :
        <Participant {...props} />
    )
}


export default CreatedRound;