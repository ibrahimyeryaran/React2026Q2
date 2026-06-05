import { memo, useMemo } from 'react';
import { List, type RowComponentProps } from 'react-window';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

// Approximate rendered height of a single card row (card + table + gap).
const ROW_HEIGHT = 360;
const LIST_HEIGHT = 720;

type RowProps = {
  countries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

const Row = ({
  index,
  style,
  countries,
  selectedYear,
  selectedColumns,
}: RowComponentProps<RowProps>) => {
  const country = countries[index];
  return (
    <div style={style}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

const CountryListComponent = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const filtered = countries.filter((c) => {
      const matchesSearch = c.id.toLowerCase().includes(query);
      const matchesRegion =
        !selectedRegion || c.data.some((d) => d.region === selectedRegion);
      return matchesSearch && matchesRegion;
    });

    if (sortField === 'name') {
      return [...filtered].sort((a, b) =>
        sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
      );
    }

    // Precompute population once per country instead of rebuilding a year map
    // inside every comparison (which was O(n log n) map allocations).
    const withPopulation = filtered.map((country) => ({
      country,
      population:
        getPopulationForYear(createYearDataMap(country.data), selectedYear) || 0,
    }));

    withPopulation.sort((a, b) =>
      sortOrder === 'asc'
        ? a.population - b.population
        : b.population - a.population
    );

    return withPopulation.map((entry) => entry.country);
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  const rowProps = useMemo<RowProps>(
    () => ({ countries: filteredCountries, selectedYear, selectedColumns }),
    [filteredCountries, selectedYear, selectedColumns]
  );

  if (filteredCountries.length === 0) {
    return <div className={styles.empty}>No countries match your search.</div>;
  }

  return (
    <div className={styles.countryList}>
      <List
        rowComponent={Row}
        rowCount={filteredCountries.length}
        rowHeight={ROW_HEIGHT}
        rowProps={rowProps}
        style={{ height: LIST_HEIGHT }}
        overscanCount={2}
      />
    </div>
  );
};

export const CountryList = memo(CountryListComponent);
