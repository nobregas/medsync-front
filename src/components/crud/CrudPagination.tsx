import { ChevronLeft, ChevronRight } from "lucide-react";

type CrudPaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
};

const maxVisiblePages = 5;

function getPageNumbers(currentPage: number, totalPages: number) {
  const visiblePageCount = Math.min(maxVisiblePages, totalPages);
  const pagesBeforeCurrent = Math.floor(visiblePageCount / 2);
  let firstPage = Math.max(1, currentPage - pagesBeforeCurrent);
  let lastPage = firstPage + visiblePageCount - 1;

  if (lastPage > totalPages) {
    lastPage = totalPages;
    firstPage = Math.max(1, lastPage - visiblePageCount + 1);
  }

  return Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index);
}

export function CrudPagination({
  currentPage,
  totalItems,
  pageSize,
  itemLabel,
  onPageChange,
}: CrudPaginationProps) {
  if (totalItems === 0) return null;

  const safePageSize = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 1;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const firstItem = (safeCurrentPage - 1) * safePageSize + 1;
  const lastItem = Math.min(safeCurrentPage * safePageSize, totalItems);
  const pageNumbers = getPageNumbers(safeCurrentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;

    onPageChange(page);
  };

  return (
    <nav className="crud-pagination" aria-label="Paginação da tabela">
      <p className="crud-pagination-info">
        Mostrando <strong>{firstItem}-{lastItem}</strong> de <strong>{totalItems}</strong>{" "}
        {itemLabel}
        <span className="crud-pagination-page-status">
          Página {safeCurrentPage} de {totalPages}
        </span>
      </p>

      <div className="crud-pagination-actions">
        <button
          className="button crud-pagination-button"
          type="button"
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="crud-pagination-pages" role="group" aria-label="Páginas">
          {pageNumbers.map((page) => (
            <button
              className={`button crud-pagination-page${page === safeCurrentPage ? " active" : ""}`}
              type="button"
              key={page}
              onClick={() => handlePageChange(page)}
              aria-current={page === safeCurrentPage ? "page" : undefined}
              aria-label={`Ir para página ${page}`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="button crud-pagination-button"
          type="button"
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          aria-label="Próxima página"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
