import { apiCall } from '../utils/apiCallUtils';
import { filterByString } from '../utils/filterByStringUtils';
import { login } from '../utils/loginUtils';
import { pagination } from '../utils/paginationUtils';
import { search } from '../utils/searchUtils';
import { tableColumnsSorting } from '../utils/tableColumnSortingUtils';
import { tableColumns } from '../utils/tableColumnUtils';

describe('FilterComponent E2E Tests', () => {
  beforeEach(() => {
    login();
    cy.waitUntilDashboardIsLoaded();
    // cy.wait(500);
    apiCall();
    cy.get('[id="runs"]').click();
  });

  it('should display the correct columns', () => {
    const emptyText =
      'Nothing to see here, it seems like no run has been configured yet.';
    const columnList = [
      'RUN ID',
      'RUN NAME',
      'PIPELINE',
      'STATUS',
      'STACK NAME',
      'AUTHOR',
      'CREATED AT',
    ];
    tableColumns(columnList, emptyText);
  });

  it.only('should sort table columns', () => {
    const columnTestIds = [
      'Id',
      'Name',
      'Pipeline',
      'Status',
      'stack_name',
      'Author',
      'created_at',
    ];
    columnTestIds.forEach((col) => {
      apiCall();
      tableColumnsSorting(col);
    });
  });

  it('should work with valid value', () => {
    search('pipeline');
  });

  it('should apply filters where string', () => {
    const columnList = ['ID', 'Name'];
    columnList.forEach((col) => {
      filterByString(col);
    });
  });
  it('should navigate through pagination', () => {
    // Assuming you have a button or link for next and previous pagination
    // You can click these buttons to navigate through pages
    pagination(); // Click the "Previous" button
    // Add more assertions as needed
  });
});
