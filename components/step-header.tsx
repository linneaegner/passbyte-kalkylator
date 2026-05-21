interface StepHeaderProps {
  step: number
  title: string
  subtitle?: string
  id?: string
}

export function StepHeader({ step, title, subtitle, id }: StepHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm"
        aria-hidden
      >
        {step}
      </div>
      <div className="min-w-0 pt-0.5">
        <h2 id={id} className="text-base font-semibold text-foreground leading-tight">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}
