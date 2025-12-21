import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/markets/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/markets/"!</div>
}
