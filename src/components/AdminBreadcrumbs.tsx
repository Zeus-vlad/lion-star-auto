import Link from 'next/link';
import { ChevronRight, LayoutDashboard } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

export function AdminBreadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-white/50 mb-6 flex-wrap" aria-label="Breadcrumb">
      <Link href="/admin" className="flex items-center gap-1.5 hover:text-primary transition-colors">
        <LayoutDashboard className="w-3.5 h-3.5" />
        Dashboard
      </Link>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          {c.href ? (
            <Link href={c.href} className="hover:text-primary transition-colors">
              {c.label}
            </Link>
          ) : (
            <span className="text-white/80 font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
