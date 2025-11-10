import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Grid, List, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProducts, type Product } from "@/lib/api";
import { formatEUR } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { QuickOrderDialog } from "@/components/site/QuickOrderDialog";

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const orderSlug = searchParams.get("order");

  const searchQuery = useMemo(
    () => (searchParams.get("search") || "").trim(),
    [searchParams]
  );
  const normalizedSearchQuery = useMemo(
    () => searchQuery.toLocaleLowerCase(),
    [searchQuery]
  );

  const {
    data: products = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products", normalizedSearchQuery],
    queryFn: ({ signal }) =>
      fetchProducts(normalizedSearchQuery || undefined, signal),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (!error) {
      return;
    }

    toast({
      title: "Грешка",
      description:
        error.message || "Не можеме да ги вчитаме производите во моментов.",
      variant: "destructive",
    });
  }, [error, toast]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price-low": {
          const priceA = Number(a.price) || 0;
          const priceB = Number(b.price) || 0;
          return priceA - priceB;
        }
        case "price-high": {
          const priceA = Number(a.price) || 0;
          const priceB = Number(b.price) || 0;
          return priceB - priceA;
        }
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Производи
          </h1>
          <p className="text-lg text-muted-foreground">
            Откријте ги сите наши природни решенија за здравје и убавина
          </p>
        </div>

        {/* Filters - hidden on mobile for simpler UX */}
        <div className="hidden md:flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-muted/20 rounded-lg">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Сортирај по" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Најнови</SelectItem>
              <SelectItem value="name">Име (А-Ш)</SelectItem>
              <SelectItem value="price-low">Цена (ниска-висока)</SelectItem>
              <SelectItem value="price-high">Цена (висока-ниска)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Се вчитува..."
              : sortedProducts.length
              ? `${sortedProducts.length} производи${
                  searchQuery ? ` за "${searchQuery}"` : ""
                }`
              : searchQuery
              ? `Нема производи за "${searchQuery}"`
              : "Нема достапни производи"}
          </p>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {sortedProducts.map((product) => {
              const primaryImage =
                product.primary_image_url ||
                product.image ||
                product.image_url ||
                null;

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
                >
                  <div
                    className={
                      viewMode === "grid"
                        ? "aspect-[4/3]"
                        : "aspect-[4/3] lg:aspect-[2/1]"
                    }
                  >
                    <div className="w-full h-full bg-transparent flex items-center justify-center relative overflow-hidden p-2 sm:p-3 md:p-4">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={product.title}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-2">🌿</div>
                          <p className="text-xs text-muted-foreground">
                            Слика на производ
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatEUR(Number(product.price) || 0)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatEUR(
                          Number((product as any).original_price) || 4800
                        )}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <QuickOrderDialog
                      product={product}
                      defaultOpen={orderSlug === product.slug}
                      trigger={
                        <Button className="flex-1 bg-[#0052cc] hover:bg-[#0065ff] text-white font-semibold">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Нарачај
                        </Button>
                      }
                    />

                    <Button
                      asChild
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link to={`/products/${product.slug}`}>Детали</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && !isFetching && sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Нема најдено производи
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Пробајте со различен збор за пребарување или проверете дали има достапни производи."
                : "Моментално нема објавени производи. Навратете се повторно."}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
