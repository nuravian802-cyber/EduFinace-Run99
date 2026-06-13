import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const startEntry = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>Tampilkan</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => {
              onItemsPerPageChange(Number(e.target.value));
              onPageChange(1);
            }}
            style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>Entri</span>
        </div>
      </div>
      
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Showing <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{startEntry}</span> to <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{endEntry}</span> of <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{totalItems}</span> entries
      </div>

      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
        <button 
          onClick={handlePrev} 
          disabled={currentPage === 1}
          style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: currentPage === 1 ? 'var(--bg-body)' : 'var(--bg-surface)', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-main)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
        >
          Prev
        </button>
        
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            style={{ 
              padding: '0.5rem 0.75rem', 
              border: page === currentPage ? 'none' : page === '...' ? 'none' : '1px solid var(--border-color)', 
              borderRadius: '6px', 
              background: page === currentPage ? 'var(--primary)' : 'var(--bg-surface)', 
              color: page === currentPage ? 'white' : 'var(--text-main)',
              fontWeight: page === currentPage ? 700 : 600,
              cursor: page === '...' ? 'default' : 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {page}
          </button>
        ))}

        <button 
          onClick={handleNext} 
          disabled={currentPage === totalPages}
          style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: currentPage === totalPages ? 'var(--bg-body)' : 'var(--bg-surface)', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-main)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
