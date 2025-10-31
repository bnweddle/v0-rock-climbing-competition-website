import { Header } from "@/components/header"
import { CostumeGallery } from "@/components/costume-gallery"

export default function CostumesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12">
        <CostumeGallery />
      </main>
    </div>
  )
}
