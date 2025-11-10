import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { fetchProductBySlug, type Product } from "@/lib/api";
import { formatEUR } from "@/lib/utils";
import { QuickOrderDialog } from "@/components/site/QuickOrderDialog";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    data: product,
    isLoading,
    isFetching,
    error,
  } = useQuery<Product | null, Error>({
    queryKey: ["product", slug],
    queryFn: ({ signal }) => fetchProductBySlug(slug!, signal),
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (!product) {
      if (!isLoading && !isFetching && slug && !error) {
        toast({
          position: "center",
          title: "Производот не е достапен",
          description: "Производот што го барате не постои или е неактивен.",
          variant: "destructive",
        });
      }
      return;
    }

    setSelectedImage((current) => {
      const availableImages = [
        product.primary_image_url,
        product.image,
        product.image_url,
      ].filter(Boolean) as string[];
      if (current && availableImages.includes(current)) {
        return current;
      }
      return availableImages[0] ?? null;
    });
  }, [product, isLoading, isFetching, slug, error, toast]);

  useEffect(() => {
    if (!error) {
      return;
    }

    console.error("Error loading product:", error);
    toast({
      position: "center",
      title: "Грешка",
      description:
        error.message || "Не можеме да ги вчитаме деталите за овој производ.",
      variant: "destructive",
    });
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">Loading...</div>
        </main>
      </div>
    );
  }

  if (error && !isLoading && !isFetching) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              Се појави грешка
            </h1>
            <p className="text-muted-foreground">
              {error.message ||
                "Не можеме да ги вчитаме деталите за овој производ во моментов."}
            </p>
            <Button asChild>
              <Link to="/products">Назад кон производи</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!product && !isFetching && !error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Производот не е најден
            </h1>
            <Button asChild>
              <Link to="/products">Назад кон производи</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = [
    product.primary_image_url,
    product.image,
    product.image_url,
  ].filter(Boolean) as string[];
  const primaryImage = selectedImage || images[0] || null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Назад кон производи
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-lg overflow-hidden bg-transparent p-2 sm:p-4 md:p-6">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🌿</div>
                  <p className="text-muted-foreground">{product.title}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {formatEUR(Number(product.price) || 0)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {formatEUR(Number((product as any).original_price) || 4800)}
                </span>
              </div>
              {product.description && (
                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Нарачај сега - Плати при достава</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Оставете ги вашите податоци во формата и нашиот тим ќе ве
                  контактира за да ја потврди нарачката.
                </p>

                <Badge
                  variant="outline"
                  className="w-fit border-primary text-primary bg-primary/5"
                >
                  Плаќање при достава
                </Badge>

                <QuickOrderDialog
                  product={product}
                  defaultOpen={Boolean(searchParams.get("order"))}
                  trigger={
                    <Button className="w-full h-12 bg-[#0052cc] hover:bg-[#0065ff] text-white font-semibold">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Нарачај
                    </Button>
                  }
                />

                <p className="text-xs text-muted-foreground">
                  * Вашите податоци ги користиме само за да ја потврдиме
                  нарачката. Можете да се предомислите при телефонската потврда.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
