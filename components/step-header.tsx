interface StepHeaderProps {
  step: number
  title: string
  id?: string
}

export function StepHeader({ step, title, id }: StepHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm"
        aria-hidden
      >
        {step}
      </div>
      <h2 id={id} className="text-base font-semibold text-foreground leading-tight">
        {title}
      </h2>
    </div>
  )
}
