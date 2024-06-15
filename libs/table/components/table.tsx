// components/Table.tsx
'use client';
import React, { useEffect, useState } from 'react';

import {
  ColumnDef,
  ColumnHelper,
  RowData,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ModifiedPokemonType } from '../types';

interface TableProps {
  initialData: ModifiedPokemonType;
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const defaultColumn: Partial<ColumnDef<ModifiedPokemonType>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    const [value, setValue] = React.useState(initialValue);

    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <select
        // value={value as string}
        className="bg-blue-500 text-blue-950"
      >
        {value.map((el) => {
          console.log('🚀 ~ {value.map ~ el:', el);
          return (
            <option key={el} value={el.slug}>
              {el.title}
            </option>
          );
        })}
      </select>
    );
  },
};

export const Table = ({ initialData }: TableProps) => {
  const [data, setData] = useState<ModifiedPokemonType[]>([initialData]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const columnHelper = createColumnHelper<ModifiedPokemonType>();

  const columns = React.useMemo<ColumnDef<ModifiedPokemonType>[]>(
    () => [
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

  const table = useReactTable<ModifiedPokemonType>({
    data,
    columns,
    defaultColumn,
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
    debugTable: true,
  });

  const { getHeaderGroups, getRowModel } = table;

  return (
    <div className="overflow-x-auto flex justify-center">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          {getHeaderGroups().map((headerGroup, index) => (
            <tr key={index} className="bg-gray-50">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-900"
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
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className={` text-orange-600 ${
                        cell.column.id === 'active' &&
                        data[rowIndex].moves.length > 1
                          ? 'bg-yellow-50'
                          : ''
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
