import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin/admin-header"
import { AgeTiersManager } from "@/components/admin/age-tiers-manager"
import { RoutesManager } from "@/components/admin/routes-manager"
import { WallTopsManager } from "@/components/admin/wall-tops-manager"
import { BonusesManager } from "@/components/admin/bonuses-manager"
import { ParticipantsManager } from "@/components/admin/participants-manager"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage competition settings and participants</p>
        </div>

        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="walls">Wall Tops</TabsTrigger>
            <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
            <TabsTrigger value="tiers">Age Tiers</TabsTrigger>
          </TabsList>

          <TabsContent value="participants">
            <ParticipantsManager />
          </TabsContent>

          <TabsContent value="routes">
            <RoutesManager />
          </TabsContent>

          <TabsContent value="walls">
            <WallTopsManager />
          </TabsContent>

          <TabsContent value="bonuses">
            <BonusesManager />
          </TabsContent>

          <TabsContent value="tiers">
            <AgeTiersManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
