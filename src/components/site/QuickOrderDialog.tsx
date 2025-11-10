import { useId, useMemo, useState, type ReactNode } from "react";
import { Loader2, Minus, Plus } from "lucide-react";

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
import { submitOrderRequest } from "@/lib/api";
import type { Product } from "@/lib/types";

interface QuickOrderDialogProps {
  product: Product;
  trigger: ReactNode;
  defaultOpen?: boolean;
}

interface FormState {
  fullName: string;
  phone: string;
  quantity: number;
}

const initialFormState: FormState = {
  fullName: "",
  phone: "",
  quantity: 1,
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
  const fullNameId = `${instanceId}-full-name`;
  const phoneId = `${instanceId}-phone`;
  const qtyId = `${instanceId}-qty`;

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

    const fullName = formData.fullName.trim();
    const phone = formData.phone.trim();
    const quantity = Math.max(1, formData.quantity | 0);

    if (!fullName || !phone) {
      toast({
        position: "center",
        title: "Недостасуваат податоци",
        description: "Внесете име и презиме и телефон за потврда.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitOrderRequest({
        customerName: fullName,
        customerPhone: phone,
        items: [{ productId: product.id, quantity }],
      });

      toast({
        position: "center",
        title: "Нарачката е примена",
        description: "Агент ќе ве контактира наскоро.",
      });

      setFormData(initialFormState);
      setOpen(false);
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
            {/* Quantity */}
            <div className="grid gap-1.5 justify-center">
              <Label
                htmlFor={qtyId}
                className="text-xs text-muted-foreground text-center"
              >
                Количина
              </Label>
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-9 rounded-lg"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      quantity: Math.max(1, p.quantity - 1),
                    }))
                  }
                  aria-label="Намали количина"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Input
                  id={qtyId}
                  inputMode="numeric"
                  pattern="^[1-9]\d*$"
                  value={String(formData.quantity)}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      quantity: Math.max(
                        1,
                        parseInt(e.target.value || "1", 10) || 1
                      ),
                    }))
                  }
                  className="h-9 w-16 text-center rounded-lg text-center"
                />

                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-9 rounded-lg"
                  onClick={() =>
                    setFormData((p) => ({ ...p, quantity: p.quantity + 1 }))
                  }
                  aria-label="Зголеми количина"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Name */}
            <div className="grid gap-1.5 text-left">
              <Label htmlFor={fullNameId}>Име и презиме *</Label>
              <Input
                id={fullNameId}
                autoComplete="name"
                placeholder="Пример: Ана Анастасова"
                className="h-11 rounded-xl"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, fullName: e.target.value }))
                }
                required
              />
            </div>

            {/* Phone */}
            <div className="grid gap-1.5 text-left">
              <Label htmlFor={phoneId}>Телефон *</Label>
              <Input
                id={phoneId}
                autoComplete="tel"
                inputMode="numeric"
                placeholder="07X XXX XXX"
                className="h-11 rounded-xl"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    phone: formatPhone(e.target.value),
                  }))
                }
                pattern="^0\d{2}\s\d{3}\s\d{3}$"
                title="Внесете телефон во формат 07X XXX XXX"
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
                "Потврди нарачка"
              )}
            </Button>

            <p className="text-[11px] text-muted-foreground text-center">
              Нема онлајн плаќање. Ќе ве контактираме за потврда.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
