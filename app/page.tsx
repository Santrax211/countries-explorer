"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Moon, Sun, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface Country {
  name: {
    common: string
    official: string
  }
  cca3: string
  flags: {
    png: string
    svg: string
    alt?: string
  }
  region: string
  population: number
  capital?: string[]
}

const regions = ["Todas las Regiones", "África", "América", "Asia", "Europa", "Oceanía"]

const regionMapping: { [key: string]: string } = {
  Africa: "África",
  Americas: "América",
  Asia: "Asia",
  Europe: "Europa",
  Oceania: "Oceanía",
}

export default function CountriesExplorer() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isDark, setIsDark] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get("region") || "Todas las Regiones")
  const [populationRange, setPopulationRange] = useState([
    Number.parseInt(searchParams.get("minPop") || "0"),
    Number.parseInt(searchParams.get("maxPop") || "1500000000"),
  ])

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca3,flags,region,population,capital",
        )
        const data = await response.json()
        setCountries(data.sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common)))
      } catch (error) {
        console.error("Error fetching countries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (selectedRegion !== "Todas las Regiones") params.set("region", selectedRegion)
    if (populationRange[0] > 0) params.set("minPop", populationRange[0].toString())
    if (populationRange[1] < 1500000000) params.set("maxPop", populationRange[1].toString())

    const queryString = params.toString()
    const newUrl = queryString ? `/?${queryString}` : "/"
    router.replace(newUrl, { scroll: false })
  }, [searchTerm, selectedRegion, populationRange, router])

  // Filter countries
  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRegion = selectedRegion === "Todas las Regiones" || regionMapping[country.region] === selectedRegion
      const matchesPopulation = country.population >= populationRange[0] && country.population <= populationRange[1]

      return matchesSearch && matchesRegion && matchesPopulation
    })
  }, [countries, searchTerm, selectedRegion, populationRange])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  // Format population number
  const formatPopulation = (pop: number) => {
    if (pop >= 1000000000) return `${(pop / 1000000000).toFixed(1)}B`
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`
    if (pop >= 1000) return `${(pop / 1000).toFixed(0)}K`
    return pop.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Globe className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Cargando países...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Explorador de Países</h1>
                <p className="text-sm text-muted-foreground">Descubre las naciones del mundo</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar países..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Region Filter */}
            <div className="w-full lg:w-48">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar región" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Population Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Rango de Población</Label>
            <div className="px-3">
              <Slider
                value={populationRange}
                onValueChange={setPopulationRange}
                max={1500000000}
                min={0}
                step={1000000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{formatPopulation(populationRange[0])}</span>
                <span>{formatPopulation(populationRange[1])}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredCountries.length} de {countries.length} países
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
            <Card
              key={country.cca3}
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50"
              onClick={() => setSelectedCountry(country)}
            >
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={country.flags.png || "/placeholder.svg"}
                    alt={country.flags.alt || `Bandera de ${country.name.common}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {country.name.common}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Región:</span>
                      <Badge variant="secondary" className="text-xs">
                        {regionMapping[country.region] || country.region}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Población:</span>
                      <span className="font-medium">{formatPopulation(country.population)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron países</h3>
            <p className="text-muted-foreground">Intenta ajustar tu búsqueda o criterios de filtro</p>
          </div>
        )}
      </main>

      {/* Country Detail Modal */}
      <Dialog open={!!selectedCountry} onOpenChange={() => setSelectedCountry(null)}>
        <DialogContent className="max-w-2xl">
          {selectedCountry && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <img
                    src={selectedCountry.flags.png || "/placeholder.svg"}
                    alt={`Bandera de ${selectedCountry.name.common}`}
                    className="w-8 h-6 object-cover rounded"
                  />
                  {selectedCountry.name.common}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={selectedCountry.flags.png || "/placeholder.svg"}
                    alt={`Bandera de ${selectedCountry.name.common}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nombre Oficial</Label>
                      <p className="text-foreground font-medium">{selectedCountry.name.official}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Región</Label>
                      <p className="text-foreground">
                        {regionMapping[selectedCountry.region] || selectedCountry.region}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Población</Label>
                      <p className="text-foreground font-medium">
                        {selectedCountry.population.toLocaleString("es-ES")}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Capital</Label>
                      <p className="text-foreground">{selectedCountry.capital?.join(", ") || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
