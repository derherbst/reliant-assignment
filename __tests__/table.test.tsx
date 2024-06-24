/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  act,
} from '@testing-library/react';
import { Table } from '../libs/table/components/table'; // Adjust the import path as needed
import { ModifiedPokemonType } from '../libs/table/types';

import '@testing-library/jest-dom';
// Mock data
const initialFirstRowData: ModifiedPokemonType = {
  name: 'Flying',
  pokemon: [
    {
      value: 'pikachu',
      label: 'Pikachu',
    },
    {
      value: 'pikachu',
      label: 'Pikachu',
    },
    {
      value: 'butterfree',
      label: 'Butterfree',
    },
  ],
  damage_relations: [
    {
      value: 'double_damage_from',
      label: 'Double damage from',
    },
  ],
  moves: [
    {
      value: 'gust',
      label: 'Gust',
    },
  ],
  names: [
    {
      value: 'ひこう',
      label: 'ひこう',
    },
  ],
};

afterEach(cleanup);

function setup(jsx: React.ReactNode) {
  return {
    ...render(jsx),
  };
}

const initialTableData: ModifiedPokemonType[] = [
  {
    name: 'Flying',
    pokemon: 'Charizard',
    damage_relations: 'Double damage from',
    moves: 'Gust',
    names: 'res',
  },
];

describe('Table component', () => {
  test('renders the table with initial data', () => {
    render(
      <Table
        initialFirstRowData={initialFirstRowData}
        initialTableData={initialTableData}
      />
    );

    // Check if the header is rendered correctly
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Pokemon')).toBeInTheDocument();
    expect(screen.getByText('Damage relations')).toBeInTheDocument();
    expect(screen.getByText('Move')).toBeInTheDocument();
    expect(screen.getByText('Translations')).toBeInTheDocument();
  });

  test('handles select dropdown changes', async () => {
    const { getAllByText } = setup(
      <Table
        initialFirstRowData={initialFirstRowData}
        initialTableData={initialTableData}
      />
    );
    const select = screen.getByLabelText('Select');
    act(() => {
      screen.getByLabelText('Select').focus();
    });

    act(() => {
      fireEvent.change(screen.getByLabelText('Select'), { key: 'ArrowDown' });
    });
    await waitFor(() => getAllByText('Pikachu')[0]);

    fireEvent.change(screen.getByLabelText('Select'), {
      target: {
        value: 'Butterfree',
      },
    });

    await waitFor(() => {
      expect((select as HTMLInputElement).value).toBe('Butterfree');
    });
  });

  test('duplicates the row when copy button is clicked', () => {
    render(
      <Table
        initialFirstRowData={initialFirstRowData}
        initialTableData={initialTableData}
      />
    );

    // Click the copy button
    const copyButton = screen.getAllByText('Copy')[0];
    fireEvent.click(copyButton);

    // Check if the row is duplicated
    expect(screen.getAllByText('Flying').length).toBe(3);
    expect(screen.getAllByText('Pikachu').length).toBe(2);
  });
});
