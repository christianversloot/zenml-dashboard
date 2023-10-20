/* eslint-disable */

import { useEffect } from 'react';
import { flavorsActions, flavorPagesActions } from '../../../../redux/actions';
import { useDispatch, useLocationPath, useSelector } from '../../../hooks';
import { workspaceSelectors } from '../../../../redux/selectors';

interface ServiceInterface {
  setFetching: (arg: boolean) => void;
}

export const useService = (): ServiceInterface => {
  const locationPath = useLocationPath();
  const selectedWorkspace = useSelector(workspaceSelectors.selectedWorkspace);
  const dispatch = useDispatch();

  useEffect(() => {
    setFetching(true);
    if (locationPath.split('/')[4] === 'all_components') {
      dispatch(
        flavorsActions.getAll({
          onSuccess: () => setFetching(false),
          onFailure: () => setFetching(false),
        }),
      );
    } else {
      dispatch(
        flavorsActions.getType({
          page: 1,
          size: 8,
          type: locationPath.split('/')[4],
          sort_by: 'name',
          onSuccess: () => setFetching(false),
          onFailure: () => setFetching(false),
        }),
      );
    }
  }, [locationPath, selectedWorkspace]);

  const setFetching = (fetching: boolean) => {
    dispatch(flavorPagesActions.setFetching({ fetching }));
  };

  return {
    setFetching,
  };
};

export const callActionForFlavorsForPagination = () => {
  const dispatch = useDispatch();

  function dispatchFlavorsData(
    page: number,
    size: number,
    type: string,
    search?: string,
  ) {
    setFetching(true);
    dispatch(
      flavorsActions.getType({
        type,
        page: page,
        size: size,
        name: search,
        sort_by: 'name',
        onSuccess: () => setFetching(false),
        onFailure: () => setFetching(false),
      }),
    );
  }

  const setFetching = (fetching: boolean) => {
    dispatch(flavorPagesActions.setFetching({ fetching }));
  };

  return {
    setFetching,
    dispatchFlavorsData,
  };
};
