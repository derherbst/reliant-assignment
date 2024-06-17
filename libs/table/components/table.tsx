'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Select, { SelectInstance } from 'react-select';
import { ModifiedPokemonType, NameAndTitle } from '../types';

interface TableProps {
  initialFirstRowData: ModifiedPokemonType;
  initialTableData: ModifiedPokemonType[];
}

const columnHelper = createColumnHelper<ModifiedPokemonType>();

// Columns names and sizings setting
const columns = [
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    header: 'Type',
    size: 150,
  }),
  columnHelper.accessor('pokemon', {
    cell: (info) => info.getValue(),
    header: 'Pokemon',
  }),
  columnHelper.accessor('damage_relations', {
    cell: (info) => info.getValue(),
    header: 'Damage relations',
    size: 250,
  }),
  columnHelper.accessor('moves', {
    cell: (info) => info.getValue(),
    header: 'Move',
  }),
  columnHelper.accessor('names', {
    cell: (info) => info.getValue(),
    header: 'Translations',
    size: 150,
  }),
];

export const Table = ({
  initialFirstRowData,
  initialTableData,
}: TableProps) => {
  const [selectsData, setSelectsData] = useState<object[]>([]);
  const [newRow, setNewRow] = useState<ModifiedPokemonType>(
    initialTableData[0]
  );

  // set select ref where every select is accumulated to control every select in the table
  const selectRefs = useRef<SelectInstance<NameAndTitle>[]>([] || null);

  useEffect(() => {
    setSelectsData(transformDataForTable());
  }, []);

  // focus on the next select
  function focusNextSelect(id: number) {
    if (selectRefs.current[id]) {
      selectRefs.current[id]?.focus();
    }
  }

  const CellSelect = forwardRef<
    SelectInstance<NameAndTitle>,
    {
      options: NameAndTitle[];
      id: number;
      cellKey: string;
      onChooseOption: (id: number) => void;
    }
  >(({ options, id, cellKey, onChooseOption }, ref) => {
    const [selectValue, setSelectValue] = useState<NameAndTitle>(options[0]);

    useEffect(() => {
      setNewRow((prevData) => {
        return {
          ...prevData,
          [cellKey]: selectValue!.label,
        };
      });
    }, [selectValue]);

    return (
      <Select
        id={String(id)}
        ref={ref}
        classNames={{
          valueContainer: () =>
            'border-none text-gray-900 text-sm rounded-lg focus:ring-none focus:border-none block w-full',
        }}
        value={selectValue}
        onChange={(option) => {
          setSelectValue(option as NameAndTitle);
          onChooseOption(id);
        }}
        options={options}
        openMenuOnFocus={true}
      />
    );
  });

  // transform data into cells. those cell that have multiple options are considered as select dropdowns
  function transformDataForTable() {
    let result = {};

    Object.keys(initialFirstRowData).forEach((el, idx) => {
      if (Array.isArray(initialFirstRowData[el])) {
        result = {
          ...result,
          [el]: (
            <CellSelect
              options={initialFirstRowData[el] as NameAndTitle[]}
              cellKey={el}
              id={idx}
              ref={(el) => {
                if (el) {
                  selectRefs.current[idx - 1] = el;
                }
              }}
              onChooseOption={focusNextSelect}
            />
          ),
        };
      } else {
        result = { ...result, [el]: initialFirstRowData[el] };
      }
    });

    return [result, ...initialTableData];
  }

  // table initialisation
  const table = useReactTable({
    data: selectsData as ModifiedPokemonType[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  // create new row with selected options from each select
  const duplicateRow = () => {
    setSelectsData((prevData) => [prevData[0], newRow, ...prevData.slice(1)]);
  };

  return (
    <div className="overflow-x-auto h-full">
      <table
        {...{
          style: {
            width: table.getCenterTotalSize(),
          },
        }}
        className="bg-white outline outline-2 rounded-sm outline-teal-800 mt-12 ml-4 overflow-x-hidden"
      >
        <thead>
          {getHeaderGroups().map((headerGroup, index) => (
            <tr key={index} className="bg-gray-50 h-10">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="w-auto px-4 py-2 text-left text-sm font-medium text-gray-900 border-l-2 border-solid border-gray-300 first:border-none"
                  style={{
                    width: header.getSize(),
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row, rowIndex) => {
            return (
              <tr key={row.id} className="border-t relative h-10">
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <td
                    key={cell.id}
                    className={` text-gray-900 border-l-2 border-solid border-gray-300 first:border-none ${
                      rowIndex !== 0 || cellIndex === 0 ? 'px-4' : 'px-0'
                    }`}
                  >
                    <>{cell.getValue()}</>
                  </td>
                ))}

                {rowIndex === 0 ? (
                  <button
                    onClick={duplicateRow}
                    className="-right-8 top-1/2 transform translate-x-12 -translate-y-1/2 text-green-900 absolute py-1 px-3 border-solid border-green-900 border border-1 rounded-md hover:text-white hover:bg-green-900"
                  >
                    Copy
                  </button>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
