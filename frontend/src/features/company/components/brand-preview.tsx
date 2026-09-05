import { resolveAssetUrl } from "@/lib/asset-url"

type BrandPreviewProps = {
  name: string
  slug: string
  logoUrl: string | null
  bannerUrl: string | null
  primaryColor: string
  secondaryColor: string
  industry?: string | null
  companySize?: string | null
}

export function BrandPreview({
  name,
  slug,
  logoUrl,
  bannerUrl,
  primaryColor,
  secondaryColor,
  industry,
  companySize,
}: BrandPreviewProps) {
  const displayName = name.trim() || "Your company"
  const safePrimary = /^#/.test(primaryColor) ? primaryColor : "#0F766E"
  const safeSecondary = /^#/.test(secondaryColor) ? secondaryColor : "#F8FAFC"
  const resolvedLogo = resolveAssetUrl(logoUrl)
  const resolvedBanner = resolveAssetUrl(bannerUrl)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold">Brand preview</h2>
        <p className="text-sm text-muted-foreground">
          How your careers brand presents to candidates.
        </p>
      </div>

      <div
        className="relative h-28 overflow-hidden"
        style={{ backgroundColor: safeSecondary }}
      >
        {resolvedBanner ? (
          <img
            src={resolvedBanner}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `radial-gradient(circle at 20% 20%, ${safePrimary}33, transparent 55%), radial-gradient(circle at 80% 0%, ${safePrimary}22, transparent 40%)`,
            }}
          />
        )}
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="flex items-end gap-3 -mt-10">
          <div
            className="flex size-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-card shadow-md"
            style={{ backgroundColor: safePrimary }}
          >
            {resolvedLogo ? (
              <img src={resolvedLogo} alt="" className="size-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-white">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 pb-1">
            <p className="truncate text-lg font-semibold tracking-tight">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              /careers/{slug.trim() || "your-slug"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {industry ? (
            <span className="rounded-full bg-muted px-2.5 py-1">{industry}</span>
          ) : null}
          {companySize ? (
            <span className="rounded-full bg-muted px-2.5 py-1">
              {companySize}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Colors
          </p>
          <div className="flex gap-3">
            <ColorSwatch label="Primary" color={safePrimary} />
            <ColorSwatch label="Secondary" color={safeSecondary} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Typography
          </p>
          <p
            className="text-2xl font-semibold tracking-tight"
            style={{ color: safePrimary }}
          >
            Join {displayName}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Explore open roles and grow your career with a team that ships.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Button style
          </p>
          <button
            type="button"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: safePrimary }}
          >
            View open roles
          </button>
        </div>
      </div>
    </div>
  )
}

function ColorSwatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border px-2.5 py-2">
      <span
        className="size-7 rounded-lg border border-black/5"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="font-mono text-[10px] text-muted-foreground uppercase">
          {color}
        </p>
      </div>
    </div>
  )
}
