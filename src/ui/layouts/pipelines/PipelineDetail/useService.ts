/* eslint-disable */

import { PipelineDetailRouteParams } from '.';
import { pipelinesActions } from '../../../../redux/actions';
import {
  pipelineSelectors,
  projectSelectors,
} from '../../../../redux/selectors';
import { useParams, useSelector } from '../../../hooks';
import { useDispatch } from 'react-redux';
import { pipelinePagesActions } from '../../../../redux/actions';
import { useEffect } from 'react';
import { sign } from 'crypto';
import { filterObjectForParam } from '../../../../utils';

interface ServiceInterface {
  pipeline: TPipeline;
}

export const useService = (): ServiceInterface => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(projectSelectors.selectedProject);
  const { id } = useParams<PipelineDetailRouteParams>();

  useEffect(() => {
    setFetching(true);
    // Legacy: previously runs was in pipeline
    dispatch(
      pipelinesActions.pipelineForId({
        pipelineId: id,
        onSuccess: () => setFetching(false),
        onFailure: () => setFetching(false),
      }),
    );
    dispatch(
      pipelinesActions.allRunsByPipelineId({
        sort_by: 'created',
        logical_operator: 'and',
        pipelineId: id,
        page: 1,
        size: 5,
        onSuccess: () => setFetching(false),
        onFailure: () => setFetching(false),
      }),
    );
  }, [id]);

  const setFetching = (fetching: boolean) => {
    dispatch(pipelinePagesActions.setFetching({ fetching }));
  };

  const pipeline = useSelector(pipelineSelectors.pipelineForId(id));

  return { pipeline };
};

export const callActionForPipelineRunsForPagination = () => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(projectSelectors.selectedProject);
  // const { id } = useParams<PipelineDetailRouteParams>();
  function dispatchPipelineRunsData(
    id: any,
    page: number,
    size: number,
    filters?: any[],
  ) {
    let filtersParam = filterObjectForParam(filters);
    // console.log('aaaa', filters);
    setFetching(true);
    dispatch(
      pipelinesActions.allRunsByPipelineId({
        sort_by: 'created',
        logical_operator: Object.keys(filtersParam).length > 1 ? 'or' : 'and',
        pipelineId: id,
        page: page,
        size: size,
        filtersParam,
        onSuccess: () => setFetching(false),
        onFailure: () => setFetching(false),
      }),
    );
  }

  const setFetching = (fetching: boolean) => {
    dispatch(pipelinePagesActions.setFetching({ fetching }));
  };

  return {
    setFetching,
    dispatchPipelineRunsData,
  };
};
