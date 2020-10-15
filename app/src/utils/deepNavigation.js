import NavigationService from '../services/navigation';
import { setRouteOptions } from '../actions/routeOptions';

export const toRoundListPage = async (dispatch, page = 0) => {
  dispatch(setRouteOptions({ roundsList: { page } }));
  NavigationService.navigate('Rondas');
};
