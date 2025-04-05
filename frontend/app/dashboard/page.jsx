import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stocks Analysis</CardTitle>
            <CardDescription>Check your current stocks</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/....">
              <Button className="w-full bg-blue-400">Click-me </Button>
            </Link>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>AI Predictor</CardTitle>
            <CardDescription>Predict you stocks easily</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/exam">
              <Button className="w-full bg-blue-400"> Click-me</Button>
            </Link>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>Prize Predection</CardTitle>
            <CardDescription>Predict you stocks easily </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/....">
              <Button className="w-full bg-blue-400">Click-me</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compare Stocks</CardTitle>
            <CardDescription> Compare your stocks and choose the bestone</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/...">
              <Button className="w-full bg-blue-400">Click-me </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recomendation</CardTitle>
            <CardDescription>Try our recomend and get benifits</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/...">
              <Button className="w-full bg-blue-400"> Click-me</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}