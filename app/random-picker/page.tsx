import { RandomPickerClient } from "@/components/random-picker-client"
import { quickPageMetadata } from "@/lib/seo"

export const metadata = quickPageMetadata({
  title: "Random Picker",
  description:
    "Pilih pemenang secara acak atau manual dari daftar anggota — lengkap dengan antrian sukses, animasi, dan efek suara.",
  path: "/random-picker",
})

export default function RandomPickerPage() {
  return <RandomPickerClient />
}
