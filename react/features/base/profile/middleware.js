// @flow

import { getLocalParticipant, participantUpdated } from '../participants';
import { getProfile } from '../profile';
import { MiddlewareRegistry, toState } from '../redux';

import { PROFILE_UPDATED } from './actionTypes';

/**
 * A middleWare to update the local participant when the profile is updated.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    const result = next(action);

    switch (action.type) {
    case PROFILE_UPDATED:
        _updateLocalParticipant(store);
    }

    return result;
});

/**
 * Updates the local participant according to profile changes.
 *
 * @param {Store} store - The redux store.
 * @returns {void}
 */
function _updateLocalParticipant(store) {
    const state = toState(store);
    const localParticipant = getLocalParticipant(state);
    const profile = getProfile(state);

    store.dispatch(participantUpdated({
        // Identify that the participant to update i.e. the local participant:
        id: localParticipant && localParticipant.id,
        local: true,

        // Specify the updates to be applied to the identified participant:
        email: profile.email,
        name: profile.displayName
    }));
}
