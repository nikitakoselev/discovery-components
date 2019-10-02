import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ResultsPagination } from '../ResultsPagination';
import { wrapWithContext } from '../../../utils/testingUtils';
import { SearchContextIFC } from '../../DiscoverySearch/DiscoverySearch';

const setup = (propUpdates?: any) => {
  propUpdates = propUpdates || {};

  const paginationMock = jest.fn();
  const searchMock = jest.fn();
  const context: Partial<SearchContextIFC> = {
    onSearch: searchMock,
    onUpdateResultsPagination: paginationMock,
    searchResults: {
      matching_results: 55
    }
  };
  const paginationComponent = render(
    wrapWithContext(<ResultsPagination {...propUpdates} />, context)
  );

  const pageSizeSelect = paginationComponent.getByLabelText('Items per page:');
  const pageNumberSelect = paginationComponent.getByLabelText('Page number, of 6 pages');

  return {
    paginationMock,
    searchMock,
    pageSizeSelect,
    pageNumberSelect,
    ...paginationComponent
  };
};

describe('ResultsPaginationComponent', () => {
  describe('page number select', () => {
    test('calls onUpdateResultsPagination', () => {
      const { paginationMock, pageNumberSelect } = setup();
      fireEvent.change(pageNumberSelect, { target: { value: 2 } });

      expect(paginationMock).toBeCalledTimes(1);
      expect(paginationMock.mock.calls[0][0]).toBe(10);
    });

    test('calls onSubmit', () => {
      const { searchMock, pageNumberSelect } = setup();
      fireEvent.change(pageNumberSelect, { target: { value: 2 } });

      expect(searchMock).toBeCalledTimes(1);
    });
  });

  describe('page size select', () => {
    test('calls onUpdateResultsPagination from first page', () => {
      const { paginationMock, pageNumberSelect, pageSizeSelect } = setup();
      fireEvent.change(pageSizeSelect, { target: { value: 20 } });
      fireEvent.change(pageNumberSelect, { target: { value: 2 } });

      expect(paginationMock).toBeCalledTimes(2);
      expect(paginationMock.mock.calls[1][0]).toBe(20);
    });

    test('calls onSubmit', () => {
      const { searchMock, pageSizeSelect } = setup({ page: 2 });
      fireEvent.change(pageSizeSelect, { target: { value: 20 } });

      expect(searchMock).toBeCalledTimes(1);
    });
  });
});