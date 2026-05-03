import { Component } from 'react';
import Header from './layout/Header/Header';
import Main from './layout/Main/Main';
import Search from './components/Search/Search';
import Results from './components/Results/Results';
import Loader from './components/Loader/Loader';
import ErrorTestButton from './components/Button/ErrorTestButton';
import { apiService } from './services/api';
import type { AppState, Item } from './types';

class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      searchTerm: '',
      items: [],
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { searchTerm } = this.state;
    this.setState({ loading: true, error: null });

    try {
      let items: Item[];

      if (searchTerm) {
        items = await apiService.searchItems(searchTerm);
      } else {
        items = await apiService.getAllItems();
      }

      this.setState({ items, loading: false });
    } catch (error) {
      console.error('Failed to load data:', error);
      this.setState({
        error: 'Failed to load items. Please try again.',
        loading: false,
      });
    }
  };

  handleSearch = (term: string) => {
    if (term === this.state.searchTerm) {
      return;
    }

    this.setState({ searchTerm: term }, () => {
      this.loadData();
    });
  };

  render() {
    const { items, loading, error, searchTerm } = this.state;

    return (
      <div>
        <Header />
        <Main>
          <Search onSearch={this.handleSearch} initialSearchTerm={searchTerm} />

          {loading && <Loader />}

          {error && <div>{error}</div>}

          {!loading && !error && <Results items={items} />}

          <div style={{ marginTop: '2rem' }}>
            <ErrorTestButton />
          </div>
        </Main>
      </div>
    );
  }
}

export default App;
