"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BackButton() {
  const pathname = usePathname();

  // Determine candidate "parent" routes for the back label.
  const crumbs = pathname.split("/").filter(Boolean);
  const parentPath = crumbs.length > 0 ? "/" + crumbs.slice(0, -1).join("/") : "/";
  const parentLabel = crumbs.length ? crumbs[crumbs.length - 1] : "home";

  return (
    <Link
      href={parentPath}
      className="inline-flex items-center gap-1 text-primary hover:underline text-sm mb-4 no-underline"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="capitalize">Back to {parentLabel}</span>
    </Link>
  );
}
