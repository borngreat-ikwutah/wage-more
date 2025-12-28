import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/_public/markets/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/_public/markets/"!</div>
}
