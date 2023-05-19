import React, { useEffect, useState } from 'react';

import { translate } from '../translate';
import { CollapseTable } from '../../../common/CollapseTable';
import { useHistory, useSelector } from '../../../../hooks';
import { routePaths } from '../../../../../routes/routePaths';

import { useService } from './useService';
import { GetHeaderCols } from './getHeaderCols';
// import { RunsForSecretTable } from './RunsForSecretTable';
import {
  workspaceSelectors,
  // stackSelectors,
  connectorSelectors,
} from '../../../../../redux/selectors';
// import { callActionForSecretsForPagination } from '../useService';
// import { stacksActions } from '../../../../../redux/actions';
import { Pagination } from '../../../common/Pagination';
import { usePaginationAsQueryParam } from '../../../../hooks/usePaginationAsQueryParam';
import { Box, FlexBox, If, PrimaryButton } from '../../../../components';
import { ItemPerPage } from '../../../common/ItemPerPage';
import { callActionForConnectorsForPagination } from '../useService';

interface Props {
  filter: any;
  pagination?: boolean;
  id?: string;
  isExpended?: boolean;
  // stackComponentId?: TId;
}
export const List: React.FC<Props> = ({
  filter,
  pagination = true,
  isExpended,
  id,
}: // stackComponentId,
Props) => {
  const history = useHistory();
  // const dispatch = useDispatch();
  // const [
  //   fetchingForSecretsFroComponents,
  //   setFetchingForSecretsFroComponents,
  // ] = useState(false);

  const ITEMS_PER_PAGE = parseInt(
    process.env.REACT_APP_ITEMS_PER_PAGE as string,
  );
  const DEFAULT_ITEMS_PER_PAGE = 10;
  const {
    openConnectorIds,
    setOpenConnectorIds,
    fetching,
    filteredConnectors,
    setFilteredConnectors,
    activeSorting,
    setActiveSorting,
    activeSortingDirection,
    setActiveSortingDirection,
    setSelectedRunIds,
  } = useService({ filter, isExpended });
  const connectorsPaginated = useSelector(
    connectorSelectors.myConnectorsPaginated,
  );
  const { pageIndex, setPageIndex } = usePaginationAsQueryParam();

  const [itemPerPage, setItemPerPage] = useState(
    ITEMS_PER_PAGE ? ITEMS_PER_PAGE : DEFAULT_ITEMS_PER_PAGE,
  );
  const initialRef: any = null;
  const childRef = React.useRef(initialRef);
  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [stackComponentId]);
  const { dispatchConnectorData } = callActionForConnectorsForPagination();
  const expendedRow = filteredConnectors.filter((item: any) => item.id === id);

  const headerCols = GetHeaderCols({
    expendedRow,
    openConnectorIds,
    setOpenConnectorIds,
    filteredConnectors,
    setFilteredConnectors: setFilteredConnectors,
    activeSorting,
    setActiveSorting,
    activeSortingDirection,
    setActiveSortingDirection,
  });
  const selectedWorkspace = useSelector(workspaceSelectors.selectedWorkspace);

  const openDetailPage = (connector: any) => {
    console.log('click', connector);
    setSelectedRunIds([]);
    if (id) {
      history.push(routePaths.connectors.list(selectedWorkspace));
    } else {
      history.push(
        routePaths.connectors.configuration(connector.id, selectedWorkspace),
      );
    }
  };

  const validFilters = filter?.filter((item: any) => item.value);
  const isValidFilterFroValue: any = filter?.map((f: any) => f.value).join('');
  const isValidFilterForCategory: any = filter
    ?.map((f: any) => f.value && f.type.value)
    .join('');
  const checkValidFilter = isValidFilterFroValue + isValidFilterForCategory;

  useEffect(() => {
    // if (stackComponentId && !filter) {
    //   setFetchingForSecretsFroComponents(true);
    //   dispatch(
    //     stacksActions.getMy({
    //       component_id: stackComponentId,
    //       sort_by: 'desc:created',
    //       logical_operator: 'and',
    //       page: 1,
    //       size: ITEMS_PER_PAGE ? ITEMS_PER_PAGE : DEFAULT_ITEMS_PER_PAGE,
    //       workspace: selectedWorkspace,
    //       onSuccess: () => setFetchingForSecretsFroComponents(false),
    //       onFailure: () => setFetchingForSecretsFroComponents(false),
    //     }),
    //   );
    // } else {
    if (filter) {
      setPageIndex(0);
      // if (stackComponentId) {
      dispatchConnectorData(
        1,
        itemPerPage,
        checkValidFilter.length ? (validFilters as any) : [],
        (activeSortingDirection?.toLowerCase() + ':' + activeSorting) as any,
        // stackComponentId,
      );
      // } else {
      //   dispatchConnectorData(
      //     1,
      //     itemPerPage,
      //     checkValidFilter.length ? (validFilters as any) : [],
      //     (activeSortingDirection?.toLowerCase() + ':' + activeSorting) as any,
      //   );
      // }
    }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    checkValidFilter,
    activeSortingDirection,
    activeSorting,
    // stackComponentId,
  ]);
  const onChange = (pageNumber: any, size: any) => {
    // if (stackComponentId) {
    //   dispatchConnectorData(
    //     pageNumber,
    //     size,
    //     checkValidFilter.length ? (validFilters as any) : [],
    //     (activeSortingDirection?.toLowerCase() + ':' + activeSorting) as any,
    //     // stackComponentId,
    //   );
    // } else {
    dispatchConnectorData(
      pageNumber,
      size,
      checkValidFilter.length ? (validFilters as any) : [],
      (activeSortingDirection?.toLowerCase() + ':' + activeSorting) as any,
    );
    // }
  };

  return (
    <>
      <CollapseTable
        renderAfterRow={(connector: any) => (
          <>
            {/* <RunsForSecretTable
              nestedRow={true}
              connector={connector}
              openConnectorIds={openConnectorIds}
              fetching={fetching}
            /> */}
          </>
        )}
        activeSorting={
          activeSortingDirection?.toLowerCase() + ':' + activeSorting
        }
        pagination={pagination}
        paginated={connectorsPaginated}
        loading={fetching}
        showHeader={true}
        filters={filter}
        headerCols={headerCols}
        tableRows={filteredConnectors}
        emptyState={{ text: translate('emptyState.text') }}
        trOnClick={openDetailPage}
      />
      <If condition={connectorsPaginated.totalitem > 5}>
        {() => (
          <FlexBox
            style={{
              position: 'fixed',
              right: '0',
              bottom: '0',
              height: '92px',
              width: '100%',
              justifyContent: 'center',
              backgroundColor: 'white',
              // marginRight: '45px',
            }}
          >
            <Box style={{ alignSelf: 'center' }}>
              <If condition={!fetching}>
                {() => (
                  <FlexBox
                    marginTop="xxxl"
                    marginBottom="xxxl"
                    style={{ alignSelf: 'center' }}
                    justifyContent="center"
                  >
                    <Pagination
                      // isExpended={isExpended}
                      ref={childRef}
                      onChange={(pageNumber: any) =>
                        onChange(pageNumber, itemPerPage)
                      }
                      // getFetchedState={getFetchedState}
                      activeSorting={activeSorting}
                      filters={filter}
                      itemPerPage={itemPerPage}
                      pageIndex={pageIndex}
                      setPageIndex={setPageIndex}
                      pages={connectorsPaginated?.totalPages}
                      totalOfPages={connectorsPaginated?.totalPages}
                      totalLength={connectorsPaginated?.length}
                      totalCount={connectorsPaginated?.totalitem}
                    />

                    <If
                      condition={
                        filteredConnectors.length > 0 &&
                        connectorsPaginated?.totalitem > 1
                      }
                    >
                      {() => (
                        <ItemPerPage
                          itemPerPage={itemPerPage}
                          onChangePagePerItem={(size: any) => {
                            setItemPerPage(size);
                            onChange(1, size);
                            setPageIndex(0);
                          }}
                        ></ItemPerPage>
                      )}
                    </If>
                  </FlexBox>
                )}
              </If>
            </Box>
          </FlexBox>
        )}
      </If>
      <FlexBox
        style={{
          position: 'fixed',
          right: '0',
          bottom: '0',
          marginRight: '45px',
        }}
      >
        <Box marginBottom="lg">
          <PrimaryButton
            onClick={() =>
              history.push(
                routePaths.connectors.connectorTypes(selectedWorkspace),
              )
            }
            // onClick={() =>
            //   history.push(routePaths.connectors.registerConnectors)
            // }
          >
            Register Connector
          </PrimaryButton>
        </Box>
      </FlexBox>
    </>
  );
};