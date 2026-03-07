import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    if (totalPages <= 1) return null;

    // Build an array of page numbers to show (up to 5 centered on current)
    const delta = 2;
    const range: (number | '...')[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - delta && i <= currentPage + delta)
        ) {
            range.push(i);
        } else if (
            range[range.length - 1] !== '...'
        ) {
            range.push('...');
        }
    }

    const linkClass = (active: boolean, disabled = false) =>
        [
            'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all',
            active
                ? 'bg-nordic-dark dark:bg-white text-white dark:text-nordic-dark shadow-sm'
                : disabled
                    ? 'opacity-30 pointer-events-none text-nordic-muted'
                    : 'text-nordic-muted hover:text-nordic-dark dark:hover:text-white hover:bg-white dark:hover:bg-white/10',
        ].join(' ');

    return (
        <nav
            aria-label="Pagination"
            className="mt-10 flex items-center justify-center gap-1"
        >
            {/* Prev */}
            <Link
                href={`?page=${currentPage - 1}`}
                aria-label="Previous page"
                className={linkClass(false, currentPage === 1)}
            >
                <span className="material-icons text-lg">chevron_left</span>
            </Link>

            {range.map((item, idx) =>
                item === '...' ? (
                    <span
                        key={`ellipsis-${idx}`}
                        className="inline-flex items-center justify-center w-9 h-9 text-sm text-nordic-muted"
                    >
                        …
                    </span>
                ) : (
                    <Link
                        key={item}
                        href={`?page=${item}`}
                        aria-current={item === currentPage ? 'page' : undefined}
                        className={linkClass(item === currentPage)}
                    >
                        {item}
                    </Link>
                )
            )}

            {/* Next */}
            <Link
                href={`?page=${currentPage + 1}`}
                aria-label="Next page"
                className={linkClass(false, currentPage === totalPages)}
            >
                <span className="material-icons text-lg">chevron_right</span>
            </Link>
        </nav>
    );
}
