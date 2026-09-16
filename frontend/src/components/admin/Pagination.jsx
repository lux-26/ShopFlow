import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  itemLabel,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="table-footer-pagination">
      <span className="pagination-info">
        {totalItems === 0
          ? `Aucun ${itemLabel}`
          : `Affichage ${firstItem}-${lastItem} sur ${totalItems} ${itemLabel}`}
      </span>

      {totalItems > 0 && (
        <div className="pagination-buttons" aria-label={`Pagination des ${itemLabel}`}>
          <button
            type="button"
            className="btn-page-nav"
            aria-label="Page précédente"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                type="button"
                key={page}
                className={`btn-page-num ${page === currentPage ? "active" : ""}`}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            className="btn-page-nav"
            aria-label="Page suivante"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
}
