type PublicFooterProps = {
  companyName: string
}

export function PublicFooter({ companyName }: PublicFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--public-border)] px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 text-sm text-[var(--public-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {companyName}
        </p>
        <p>Careers</p>
      </div>
    </footer>
  )
}
