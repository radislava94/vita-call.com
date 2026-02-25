import { useId, useMemo, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

interface QuickOrderDialogProps {
  product: Product;
  trigger: ReactNode;
  defaultOpen?: boolean;
}

interface FormState {
  ime: string;
  prezime: string;
  telefon: string;
  grad: string;
}

const initialFormState: FormState = {
  ime: "",
  prezime: "",
  telefon: "",
  grad: "",
};

export function QuickOrderDialog({ product, trigger, defaultOpen = false }: QuickOrderDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(defaultOpen);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const primaryImage = useMemo(() => {
    return (
      product.primary_image_url || product.image || product.image_url || null
    );
  }, [product]);

  const instanceId = useId();
  const imeId = `${instanceId}-ime`;
  const prezimeId = `${instanceId}-prezime`;
  const telefonId = `${instanceId}-telefon`;
  const gradId = `${instanceId}-grad`;

  const handleOpenChange = (nextOpen: boolean) => {
    if (submitting) return;
    if (!nextOpen) setFormData(initialFormState);
    setOpen(nextOpen);
  };

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 9); // 07x xxx xxx
    return digits
      .replace(/(\d{3})(\d)/, "$1 $2")
      .replace(/(\d{3}) (\d{3})(\d)/, "$1 $2 $3");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ime = formData.ime.trim();
    const prezime = formData.prezime.trim();
    const telefon = formData.telefon.trim();
    const grad = formData.grad.trim();

    if (!ime || !prezime || !telefon || !grad) {
      toast({
        position: "center",
        title: "Недостасуваат податоци",
        description: "Внесете сите полиња.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        "https://huxlrpskxbdbzlhcpdyo.supabase.co/functions/v1/api/webhook/arthrovita-86ebec95",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ime,
            prezime,
            telefon,
            grad,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Не успеавме да ја испратиме вашата нарачка.");
      }

      toast({
        position: "center",
        title: "Успешно!",
        description: "Ви благодариме! Ќе ве контактираме наскоро.",
      });

      setFormData(initialFormState);
      
      // Close the popup after 2 seconds
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    } catch (error: any) {
      toast({
        position: "center",
        title: "Грешка",
        description:
          error?.message ||
          "Не успеавме да ја испратиме вашата нарачка. Обидете се повторно.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="
    max-w-[28rem] p-0 border border-border/50
    bg-white text-foreground
    rounded-2xl shadow-lg
    flex flex-col items-center justify-center
    /* center everything */
    mx-auto my-auto
    duration-200
    data-[state=open]:animate-in
    data-[state=closed]:animate-out
    data-[state=open]:fade-in-0
    data-[state=closed]:fade-out-0
    data-[state=open]:zoom-in-95
    data-[state=closed]:zoom-out-95
    origin-center
  "
      >
        <div className="p-6 w-full flex flex-col items-center justify-center">
          <DialogHeader className="items-center text-center space-y-2 w-full">
            {/* Image */}
            <div className="w-28 h-28 rounded-xl overflow-hidden border border-border/50 bg-white mx-auto">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={product.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">
                  🧴
                </div>
              )}
            </div>

            <DialogTitle className="text-base font-semibold tracking-tight">
              {product.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Брза, едноставна нарачка
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 w-full text-center"
          >
            {/* Име */}
            <div className="grid gap-1.5 text-left">
              <Label htmlFor={imeId}>Име *</Label>
              <Input
                id={imeId}
                autoComplete="given-name"
                placeholder="Пример: Ана"
                className="h-11 rounded-xl"
                value={formData.ime}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, ime: e.target.value }))
                }
                required
              />
            </div>

            {/* Презиме */}
            <div className="grid gap-1.5 text-left">
              <Label htmlFor={prezimeId}>Презиме *</Label>
              <Input
                id={prezimeId}
                autoComplete="family-name"
                placeholder="Пример: Анастасова"
                className="h-11 rounded-xl"
                value={formData.prezime}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, prezime: e.target.value }))
                }
                required
              />
            </div>

            {/* Телефон */}
            <div className="grid gap-1.5 text-left">
              <Label htmlFor={telefonId}>Телефон *</Label>
              <Input
                id={telefonId}
                autoComplete="tel"
                inputMode="numeric"
                placeholder="07X XXX XXX"
                className="h-11 rounded-xl"
                value={formData.telefon}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    telefon: e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* Град */}
            <div className="grid gap-1.5 text-left">
              <Label htmlFor={gradId}>Град *</Label>
              <Input
                id={gradId}
                autoComplete="address-level2"
                placeholder="Пример: Скопје"
                className="h-11 rounded-xl"
                value={formData.grad}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, grad: e.target.value }))
                }
                required
              />
            </div>

            {/* Confirm */}
            <Button
              type="submit"
              disabled={submitting}
              className="
          w-full h-11 rounded-xl font-medium
          bg-[#0065ff] text-white 
          hover:bg-[#0055e0]
          active:bg-[#0047c0]
          transition-colors duration-200
          disabled:opacity-60
        "
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Испраќање…
                </>
              ) : (
                "Пошали"
              )}
            </Button>

            <p className="text-[11px] text-muted-foreground text-center">
              Ќе ве контактираме за потврда.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
