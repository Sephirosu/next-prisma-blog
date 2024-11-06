const Pagination = ({ currentPage, totalPages }) => {
  return (
    <div className="flex justify-between mt-4">
      <a
        href={`?page=${currentPage - 1}`}
        className={`bg-gray-300 p-2 rounded ${
          currentPage === 1 ? "disabled:opacity-50" : ""
        }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </a>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <a
        href={`?page=${currentPage + 1}`}
        className={`bg-gray-300 p-2 rounded ${
          currentPage === totalPages ? "disabled:opacity-50" : ""
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </a>
    </div>
  );
};

export default Pagination;
