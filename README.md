# Assignment task for Reliant

To run the local server:

```bash
npm run dev
```

## Requirements

The task was to implement a table with a data from a random API and implement some functionalities listed below:

- Utilise Next.js 14 with App Router for the project setup.
- Integrate an open source table library to display data fetched from an API.
- Fetch data from an open source API endpoint to populate the table.
- Implement multiple value options for each cell in the table where only one value can be active at a time.
- Highlight (indicate to the user) cells that have alternative values and enable users to view and select specific values for each cell.
- Provide a user-friendly interface for value selection within the table cells.
- Implement a feature where selecting a value for a cell triggers the next "unreviewed" (next cell containing alternative values) cell for the user to make a selection.
- Optional: Add ability for the user to split the alternative cell value to its own row (duplicating all other cells except for the selected one).

## Details

- As an API the [PokeAPI](https://pokeapi.co/) was chosen since it is free, fast and easy to use
- Next "under-the-hood" fetch was used to get data from an endpoint
- Libraries:
  - `tanstack/react-table` for the actual table
  - `react-select` to make custom user-friendly selects

## Conclusions After Finishing the Assignment Task

1. **New Row Creation**

   - Add more intuitive functionality for creating new rows.

2. **Text Fields Editing**

   - Implement text field editing as the next step.

3. **Column Population**

   - Provide an option to populate each column with the same value as the last entry, similar to Excel.

4. **AI Correction Tips**

   - Include user-friendly tips to explain AI corrections, why they occur, and how to address them.

5. **Saving Table Data**

   - Ensure functionality to save the table data.

6. **User-Friendly States**
   - Display user-friendly states for loading the table and show errors if there are server issues.
