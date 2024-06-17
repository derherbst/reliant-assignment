import { Table } from '@/libs/table/components/table';
import { PokemonType } from '@/libs/table/types';
import RootLayout from './layout';
import { makeRestData, prepareDataSelect } from '@/libs/table/helpers';
import { getData } from '@/libs/table/data';

export default async function Page() {
  const data: PokemonType = await getData();

  return (
    <RootLayout>
      <div className="bg-white h-screen">
        <Table
          initialFirstRowData={prepareDataSelect(data)}
          initialTableData={makeRestData(data)}
        />
      </div>
    </RootLayout>
  );
}
