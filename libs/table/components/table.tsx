'use client';
import React, { forwardRef, useRef, useState } from 'react';

import {
  Cell,
  RowData,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Select from 'react-select';
import { ModifiedPokemonType, NameAndTitle } from '../types';
import StateManagedSelect from 'react-select';

interface TableProps {
  initialData: ModifiedPokemonType;
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export const Table = ({ initialData }: TableProps) => {
  const [data, setData] = useState<ModifiedPokemonType[]>([initialData]);
  const selectRefs = useRef<(StateManagedSelect | null)[]>([] || null);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Type',
      },
      {
        accessorKey: 'names',
        header: 'Translations',
      },
      {
        accessorKey: 'pokemon',
        header: 'Pokemon',
      },
      {
        accessorKey: 'moves',
        header: 'Move',
      },
      {
        accessorKey: 'damage_relations',
        header: 'Damage relations',
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    enableColumnResizing: true,
    debugTable: true,
  });

  const { getHeaderGroups, getRowModel, getState } = table;

  const CellSelect = forwardRef<
    StateManagedSelect,
    { options: NameAndTitle[]; id: number }
  >(({ options, id }, ref) => {
    const [selectValue, setSelectValue] = React.useState(options[0]);

    return (
      <Select
        id={String(id)}
        ref={ref}
        classNames={{
          control: () => 'px-2',
          valueContainer: () =>
            'border-none text-gray-900 text-sm rounded-lg focus:ring-none focus:border-none block w-full',
        }}
        value={selectValue}
        onChange={(option) => {
          setSelectValue(option);
          if (selectRefs.current[id]) {
            selectRefs.current[id]?.focus();
          }
        }}
        options={options}
        openMenuOnFocus={true}
      />
    );
  });

  return (
    <div className="flex justify-center align-middle">
      <table className="bg-white outline outline-2 rounded-sm outline-teal-800 mt-12 overflow-x-hidden">
        <thead>
          {getHeaderGroups().map((headerGroup, index) => (
            <tr key={index} className="bg-gray-50">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="w-64 px-4 py-2 text-left text-sm font-medium text-gray-900 border-l-2 border-solid border-gray-300 first:border-none"
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
              <tr key={row.id} className="border-t">
                {row
                  .getVisibleCells()
                  .map(
                    (
                      cell: Cell<ModifiedPokemonType, NameAndTitle[] | string>,
                      cellIndex
                    ) => {
                      return (
                        <td
                          key={cell.id}
                          className={` text-gray-900 border-l-2 border-solid border-gray-300 first:border-none ${
                            !Array.isArray(cell.getValue()) && 'px-4'
                          }`}
                        >
                          {Array.isArray(cell.getValue()) ? (
                            <CellSelect
                              options={cell.getValue()}
                              ref={(el) =>
                                (selectRefs.current[cellIndex - 1] = el)
                              }
                              id={cellIndex}
                            />
                          ) : (
                            <>{cell.getValue()}</>
                          )}
                        </td>
                      );
                    }
                  )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
