interface CountryDataListProps {
  id: string;
  countries: string[];
}

function CountryDataList({ id, countries }: CountryDataListProps) {
  return (
    <datalist id={id}>
      {countries.map((country) => (
        <option key={country} value={country} />
      ))}
    </datalist>
  );
}

export default CountryDataList;
