import { Component } from "react";
import type { SearchProps, SearchState } from "../../types";
import Button from "../Button/Button";
import styles from "./Search.module.css";

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    const savedSearchTerm = localStorage.getItem("pokemonSearchTerm");
    const initialValue = savedSearchTerm || props.initialSearchTerm || "";
    this.state = { inputValue: initialValue };
  }

  componentDidMount() {
    const saved = localStorage.getItem("pokemonSearchTerm");
    if (saved) {
      this.props.onSearch(saved);
    }
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: event.target.value });
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.handleSearch();
    }
  };

  handleSearch = () => {
    const trimmedValue = this.state.inputValue.trim();
    if (trimmedValue) {
      localStorage.setItem("pokemonSearchTerm", trimmedValue);
    } else {
      localStorage.removeItem("pokemonSearchTerm");
    }
    this.props.onSearch(trimmedValue);
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <input
          type="text"
          className={styles.input}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Enter pokemon name"
        />
        <Button onClick={this.handleSearch}>Search</Button>
      </div>
    );
  }
}

export default Search;
