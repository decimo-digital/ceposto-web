import { useTable, usePagination, useFilters } from 'react-table'
import { useMemo, useEffect, Children, useState, useLayoutEffect } from 'react'
import Skeleton from 'react-loading-skeleton'

import Icon, { icons } from 'components/Icon'
import Input from 'components/Input'
import RadioCard from './RadioCard'
import RadioCardGroup from './RadioCardGroup'
import { assetsCodeOptions } from 'utils/enums'

const TableContainer = (props) => (
  <table
    style={{
      borderCollapse: 'separate',
      borderSpacing: '0 0.063rem'
    }}
    className="w-full"
  >
    {props.children}
  </table>
)
const TableHeadersContainer = (props) => (
  <thead className="text-left text-white bg-green-500">{props.children}</thead>
)
const TableHeaderGroup = (props) => <tr className="">{props.children}</tr>
const TableRow = (props) => <tr className="bg-white">{props.children}</tr>
const TableHead = (props) => (
  <th
    style={props.fixLeft ? { position: 'sticky', left: '0px', zIndex: 0 } : {}}
    id={props.id}
    className="bg-green-500"
  >
    {props.children}
  </th>
)
const TableCell = (props) => (
  <td
    id={props.id}
    style={props.fixLeft ? { position: 'sticky', left: '0px', zIndex: 0 } : {}}
    className={`p-1  overflow-x-hidden bg-white whitespace-nowrap ${props.borders
      } ${props.rowIndex % 2 || props.isLoading ? 'bg-white' : 'bg-gray-200'}`}
  >
    {props.isLoading ? <Skeleton height={24} /> : props.children}
  </td>
)
const TableBody = (props) => <tbody className="">{props.children}</tbody>

// Define a default UI for filtering
function DefaultColumnFilter() {
  return null
}

const Table = ({
  data,
  columns,
  onFetchData,
  loading,
  filterBy,
  filter,
  onFilterChange,
  pageCount: controlledPageCount,
  headersActionsComponents = [],
  numOfFixedCols = 0,
  noEmployees,
  isValid,
  filterByType = 'no',
  exportData,
  setFilterByType
}) => {
  // const defaultColumn = useMemo(
  //   () => ({
  //     Filter: DefaultColumnFilter,
  //   }),
  //   []
  // )

  const {
    page,
    nextPage,
    canNextPage,
    previousPage,
    canPreviousPage,
    gotoPage,
    pageOptions,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 1 },
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount
      // defaultColumn,
    },
    usePagination
  )

  useEffect(() => {
    onFetchData({ pageIndex })
  }, [onFetchData, pageIndex])

  useEffect(() => {
    gotoPage(1)
  }, [filter])

  useEffect(() => {
    let viewportWidth = window.innerWidth
    const smViewportWidth = 640

    let tds = document.getElementsByTagName('td')
    for (let i = 0; i < tds.length; i++) {
      if (viewportWidth <= smViewportWidth) {
        tds[i].style = undefined
      } else if (tds[i].nextSibling) {
        let left = tds[i].style.left
        if (left === '') left = 0
        // Here I make substring because if the DOM element has a left !== ''
        // it's written as XXXpx, so to get the numeric value the 'px' part
        // needs to be removed
        else left = Number(left.substring(0, left.length - 2))

        document.getElementById(tds[i].nextSibling.id).style.left = `${tds[i].offsetWidth + left - 1
          }px`
      }
    }

    let ths = document.getElementsByTagName('th')
    for (let i = 0; i < ths.length; i++) {
      if (viewportWidth <= smViewportWidth) {
        ths[i].style = undefined
      } else if (ths[i].nextSibling) {
        let left = ths[i].style.left
        if (left === '') left = 0
        else left = Number(left.substring(0, left.length - 2))

        document.getElementById(ths[i].nextSibling.id).style.left = `${ths[i].offsetWidth + left - 1
          }px`
      }
    }
  }, [data])

  const renderCells = (cells, rowIndex) => {
    let renderCells = []

    cells.map((cell, i) => {
      let borders = ' '
      if (i === 0) borders += 'border-l'
      if (i === cells.length - 1 || cell.column.hasDivider)
        borders += ' border-r'

      let fixLeft = i <= numOfFixedCols

      renderCells.push(
        <TableCell
          rowIndex={rowIndex}
          isLoading={loading}
          borders={borders}
          fixLeft={fixLeft}
          id={`cell${Math.floor(Math.random() * 1000000 + 1)}`}
          {...cell.getCellProps()}
        >
          {cell.render('Cell')}
        </TableCell>
      )
    })

    return renderCells
  }

  const renderRow = (row, rowIndex) =>
    prepareRow(row) || (
      <TableRow {...row.getRowProps()}>
        {renderCells(row.cells, rowIndex)}
      </TableRow>
    )

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col justify-between w-full my-2 space-y-2 sm:space-y-0 sm:w-auto sm:flex-row space-x-24">
          <div className="flex items-end">
            <button
              type="button"
              className={`flex-grow-0 p-2 px-4 bg-gray-300 cursor-pointer rounded-l-md ${pageIndex <= 1 || !canPreviousPage ? 'opacity-50' : ''
                }`}
              onClick={(e) => previousPage()}
              disabled={pageIndex <= 1 || !canPreviousPage}
            >
              {'<'}
            </button>
            <div className="flex justify-center p-2 px-6 bg-gray-300">
              {pageIndex}
              <span className="text-gray-700">&nbsp;di&nbsp;</span>
              {pageOptions.length - 1}
            </div>
            <button
              type="button"
              className={`flex-grow-0 p-2 px-4 bg-gray-300 cursor-pointer rounded-r-md ${!canNextPage ? 'opacity-50' : ''
                }`}
              onClick={(e) => nextPage()}
              disabled={!canNextPage}
            >
              {'>'}
            </button>
          </div>
          <div className="flex space-x-4 flex-grow items-end justify-end">
            <div className="flex">
              <button
                type="button"
                className={`flex p-4 bg-gray-300 items-center ${loading ? 'cursor-not-allowed' : 'cursor-pointer'
                  } rounded-md
                  }`}
                onClick={exportData}
                disabled={loading}
              >
                <div className="flex mr-2">
                  <Icon name={icons.DOWNLOAD} />
                </div>
                Esporta dati
              </button>
            </div>
            {filterByType !== 'no' && (
              <div className="flex flex-col flex-grow">
                <label className="text-gray-500" htmlFor="setFilterByType">
                  Mostra
                </label>
                <RadioCardGroup
                  id="filterByType"
                  className="flex flex-col justify-between sm:flex-row"
                >
                  <RadioCard
                    selected={filterByType === ''}
                    onClick={() => {
                      setFilterByType('')
                    }}
                  >
                    <span
                      className={`flex justify-center items-center h-full uppercase font-medium text-sm ${filterByType === '' ? 'text-green-800' : 'text-gray-700'
                        }`}
                    >
                      Tutti
                    </span>
                  </RadioCard>
                  <RadioCard
                    selected={filterByType === assetsCodeOptions[0].value}
                    onClick={() => {
                      setFilterByType(assetsCodeOptions[0].value)
                    }}
                  >
                    <span
                      className={`flex justify-center items-center h-full uppercase font-medium text-sm ${filterByType === 'tckt_purchase'
                          ? 'text-green-800'
                          : 'text-gray-700'
                        }`}
                    >
                      buoni pasto
                    </span>
                  </RadioCard>
                  <RadioCard
                    selected={filterByType === assetsCodeOptions[1].value}
                    onClick={() => {
                      setFilterByType(assetsCodeOptions[1].value)
                    }}
                  >
                    <span
                      className={`flex justify-center items-center h-full uppercase font-medium text-sm ${filterByType === 'smart_gift'
                          ? 'text-green-800'
                          : 'text-gray-700'
                        }`}
                    >
                      spese aziendali
                    </span>
                  </RadioCard>
                  <RadioCard
                    selected={filterByType === assetsCodeOptions[2].value}
                    onClick={() => {
                      setFilterByType(assetsCodeOptions[2].value)
                    }}
                  >
                    <span
                      className={`flex justify-center items-center h-full uppercase font-medium text-sm ${filterByType === 'smart_gift'
                          ? 'text-green-800'
                          : 'text-gray-700'
                        }`}
                    >
                      benefit
                    </span>
                  </RadioCard>
                </RadioCardGroup>
              </div>
            )}
            <div className="flex flex-row">
              {filterBy && (
                <div className containerclassName="w-full sm:w-1/2">
                  <Input
                    label={`Filtra per ${columns
                      .map((column) => {
                        if (
                          filterBy.includes(column.accessor) ||
                          filterBy.includes(column.id)
                        )
                          return column.Header.toLowerCase()

                        return ''
                      })
                      .filter((filterName) => filterName !== '')
                      .join()
                      .replace(/,/g, ' e ')}`}
                    isRequired={false}
                    type="text"
                    value={filter}
                    onChange={onFilterChange}
                    id="filter"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={` block overflow-x-auto `}>
          {!noEmployees && (
            <TableContainer {...getTableProps()}>
              <TableHeadersContainer>
                {headerGroups.map((headerGroup) => (
                  <TableHeaderGroup {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, i) => (
                      <TableHead
                        fixLeft={i <= numOfFixedCols}
                        id={`head${Math.floor(Math.random() * 1000000 + 1)}`}
                        {...column.getHeaderProps()}
                      >
                        <div
                          className={`flex items-center ${column.hasDivider ? 'border-r' : ''
                            } px-1 gap-4 py-2 whitespace-nowrap`}
                        >
                          {column.render('Header')}
                          {Object.keys(headersActionsComponents).includes(
                            column.id
                          ) && headersActionsComponents[column.id]}
                          {column.canFilter ? column.render('Filter') : null}
                        </div>
                      </TableHead>
                    ))}
                  </TableHeaderGroup>
                ))}
              </TableHeadersContainer>
              <TableBody isLoading={loading} {...getTableBodyProps()}>
                {page.map((row, i) => renderRow(row, i))}
              </TableBody>
            </TableContainer>
          )}
          {noEmployees && (
            <p className="mt-8 text-lg text-gray-600">Nessun dato presente.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default Table
