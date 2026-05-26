import { useNavigate, useParams, Outlet, useMatch } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Results from '../../components/Results/Results';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';
import ErrorTestButton from '../../components/Button/ErrorTestButton';
import Main from '../../layout/Main/Main';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import usePokemonSearch from '../../hooks/usePokemonSearch';
import styles from './MainPage.module.css';

const ITEMS_PER_PAGE = 21;

function MainPage() {
  const { page } = useParams<{ page: string }>();
  const navigate = useNavigate();
  const detailMatch = useMatch('/:page/details/:detailId');

  const pageNum = parseInt(page || '', 10);
  const { items, loading, error, searchTerm, handleSearch } = usePokemonSearch();

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(
    isNaN(pageNum) ? 1 : Math.max(1, pageNum),
    totalPages
  );

  if (isNaN(pageNum) || pageNum < 1) {
    return <NotFoundPage />;
  }
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const onSearch = (term: string) => {
    handleSearch(term);
    navigate('/1');
  };

  const handleCardClick = (id: number) => {
    navigate(`/${safeCurrentPage}/details/${id}`);
  };

  const handleCloseDetail = () => {
    navigate(`/${safeCurrentPage}`);
  };

  const handlePageChange = (newPage: number) => {
    navigate(`/${newPage}`);
  };

  return (
    <Main>
      <div className={detailMatch ? styles.splitLayout : ''}>
        <div
          className={styles.leftPanel}
          onClick={detailMatch ? handleCloseDetail : undefined}
        >
          {/* stopPropagation prevents interactive elements from accidentally closing the detail panel */}
          <div onClick={(e) => e.stopPropagation()}>
            <Search onSearch={onSearch} initialSearchTerm={searchTerm} />

            {loading && <Loader />}
            {error && <div className={styles.error}>{error}</div>}

            {!loading && !error && (
              <Results items={pageItems} onItemClick={handleCardClick} />
            )}

            {!loading && !error && totalPages > 1 && (
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            <div style={{ marginTop: '2rem' }}>
              <ErrorTestButton />
            </div>
          </div>
        </div>

        {detailMatch && (
          <div
            className={styles.rightPanel}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleCloseDetail}>
              ✕ Close
            </button>
            <Outlet />
          </div>
        )}
      </div>
    </Main>
  );
}

export default MainPage;
