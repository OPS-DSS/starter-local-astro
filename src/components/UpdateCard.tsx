import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function UpdateCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}
