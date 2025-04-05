import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ExternalLink } from "lucide-react"



export function PlatformConnectCard({ platform, name, description, connected, stockCount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {name}
          {connected && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600 border-emerald-200">
              <Check className="mr-1 h-3 w-3" />
              Connected
            </span>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="text-sm">
            <p className="font-medium">{stockCount} stocks connected</p>
            <p className="text-muted-foreground">Last synced: Today, 10:30 AM</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Connect your account to view and manage your investments.</p>
        )}
      </CardContent>
      <CardFooter>
        {connected ? (
          <Button variant="outline" className="w-full gap-1">
            <span>Sync</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Connect</Button>
        )}
      </CardFooter>
    </Card>
  )
}

