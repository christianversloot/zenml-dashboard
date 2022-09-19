import _ from 'lodash';
import React from 'react';
// import cn from 'classnames';

// import styles from '../index.module.scss';
import { iconColors, iconSizes, ID_MAX_LENGTH } from '../../../../../constants';
// import { translate } from '../translate';
import { formatDateToDisplay, truncate } from '../../../../../utils';
import {
  FlexBox,
  Paragraph,
  // LinkBox,
  Box,
  icons,
} from '../../../../components';
import { HeaderCol } from '../../../common/Table';
// import { RunStatus } from '../RunStatus';
// import { RunTime } from '../../RunTime';
// import { RunUser } from '../RunUser';
import { SortingHeader } from '../SortingHeader';
import { Sorting, SortingDirection } from '../types';
import { useService } from './useService';
// import { PipelineName } from '../PipelineName';

export const useHeaderCols = ({
  runs,
  setRuns,
  activeSorting,
  activeSortingDirection,
  setActiveSortingDirection,
  setActiveSorting,
}: {
  runs: TRun[];
  setRuns: (runs: TRun[]) => void;
  activeSorting: Sorting | null;
  activeSortingDirection: SortingDirection | null;
  setActiveSortingDirection: (direction: SortingDirection | null) => void;
  setActiveSorting: (sorting: Sorting | null) => void;
}): HeaderCol[] => {
  const {
    // toggleSelectRun,
    // isRunSelected,
    // selectRuns,
    // unselectRuns,
    // allRunsSelected,
    sortMethod,
  } = useService({
    setActiveSortingDirection,
    setActiveSorting,
    setRuns,
    activeSorting,
    activeSortingDirection,
    runs,
  });

  return [
    {
      width: '2%',
      renderRow: (stack: TStack) => <></>,
    },
    {
      render: () => (
        <SortingHeader
          sorting="id"
          sortMethod={sortMethod('id', {
            asc: (runs: TRun[]) => _.orderBy(runs, ['id'], ['asc']),
            desc: (runs: TRun[]) => _.orderBy(runs, ['id'], ['desc']),
          })}
          activeSorting={activeSorting}
          activeSortingDirection={activeSortingDirection}
        >
          <Paragraph size="small" color="black">
            RUN NAME
          </Paragraph>
        </SortingHeader>
      ),
      width: '10%',
      renderRow: (run: TRun) => (
        <Paragraph size="small">{truncate(run.id, ID_MAX_LENGTH)}</Paragraph>
      ),
    },
    {
      render: () => (
        <Paragraph size="small" color="black">
          STACK
        </Paragraph>
      ),
      width: '10%',
      renderRow: (run: TRun) => (
        <Paragraph size="small">{run.stack.name}</Paragraph>
      ),
    },

    {
      render: () => (
        <Paragraph size="small" color="black">
          RUN TIME
        </Paragraph>
      ),
      width: '10%',
      renderRow: (run: TRun) => (
        <Paragraph size="small">{run.duration}</Paragraph>
      ),
    },

    {
      render: () => (
        <Paragraph size="small" color="black">
          PIPELINE NAME
        </Paragraph>
      ),
      width: '10%',
      renderRow: (run: TRun) => (
        <Paragraph size="small">{run.pipeline.name}</Paragraph>
      ),
    },
    {
      render: () => (
        <Paragraph size="small" color="black">
          AUTHOR
        </Paragraph>
      ),
      width: '10%',
      renderRow: (run: TRun) => (
        <Paragraph size="small">{run.userName}</Paragraph>
      ),
    },
    {
      render: () => (
        <SortingHeader
          sorting="createdAt"
          sortMethod={sortMethod('createdAt', {
            asc: (runs: TRun[]) =>
              _.orderBy(
                runs,
                (run: TRun) => new Date(run.kubeflowStartTime).getTime(),
                ['asc'],
              ),
            desc: (runs: TRun[]) =>
              _.orderBy(
                runs,
                (run: TRun) => new Date(run.kubeflowStartTime).getTime(),
                ['desc'],
              ),
          })}
          activeSorting={activeSorting}
          activeSortingDirection={activeSortingDirection}
        >
          <Paragraph size="small" color="black">
            CREATED AT
          </Paragraph>
        </SortingHeader>
      ),
      width: '10%',
      renderRow: (run: TRun) => (
        <FlexBox alignItems="center">
          <Box paddingRight="sm">
            <icons.calendar color={iconColors.grey} size={iconSizes.sm} />
          </Box>
          <Paragraph color="grey" size="tiny">
            {formatDateToDisplay(run.creationDate)}
          </Paragraph>
        </FlexBox>
      ),
    },
  ];
};