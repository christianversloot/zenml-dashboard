import React from 'react';
import { runStatus, iconColors, iconSizes } from '../../../../../../constants';
import { Run, ServiceConnector } from '../../../../../../api/types';
import {
  Box,
  ColoredCircle,
  FlexBox,
  icons,
  If,
} from '../../../../../components';
import { useService } from './useService';

export const Status: React.FC<{ connector: ServiceConnector }> = ({
  connector,
}) => {
  const { lastThreeRuns } = useService({ connector });

  return (
    <FlexBox alignItems="center">
      {lastThreeRuns.map((run: Run, index: number) => (
        <Box key={index} paddingHorizontal="xs">
          <>
            <If condition={run.body?.status === runStatus.Succeeded}>
              {() => (
                <ColoredCircle color="green" size="xs">
                  <icons.check color={iconColors.white} size={iconSizes.xs} />
                </ColoredCircle>
              )}
            </If>
            <If condition={run.body?.status === runStatus.Failed}>
              {() => (
                <ColoredCircle color="red" size="xs">
                  <icons.close color={iconColors.white} size={iconSizes.xs} />
                </ColoredCircle>
              )}
            </If>
          </>
        </Box>
      ))}
    </FlexBox>
  );
};
