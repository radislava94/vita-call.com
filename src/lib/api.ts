import { mockProducts } from "@/assets/products/mockProducts";
import type { Order, OrderItem, Product } from "@/lib/types";

// This project intentionally ships with mock/static data only.
// We return from mocks immediately for instant rendering with no network delay.

function matchesSearch(product: Product, search?: string): boolean {
  if (!search) return true;
  const haystack = `${product.title ?? ""} ${product.description ?? ""} ${product.slug ?? ""}`.toLowerCase();
  return haystack.includes(search.trim().toLowerCase());
}

function sampleMockProducts(search?: string): Product[] {
  return mockProducts.filter((product) => matchesSearch(product, search));
}

export async function fetchProducts(search?: string, _signal?: AbortSignal): Promise<Product[]> {
  const products = sampleMockProducts(search);
  if (!products.length) {
    throw new Error("No products found in mock data.");
  }
  return products;
}

export async function fetchProductBySlug(slug: string, _signal?: AbortSignal): Promise<Product | null> {
  return mockProducts.find((product) => product.slug === slug) ?? null;
}

export interface OrderRequestPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  notes?: string;
  paymentMethod?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

function buildMockOrder(payload: OrderRequestPayload): Order {
  const createdAt = new Date().toISOString();
  const items: OrderItem[] = payload.items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
    product: mockProducts.find((product) => product.id === item.productId),
  }));

  return {
    id: `demo-${Date.now()}`,
    status: "pending",
    created_at: createdAt,
    customer_name: payload.customerName,
    customer_phone: payload.customerPhone,
    customer_email: payload.customerEmail ?? null,
    customer_address: payload.customerAddress ?? null,
    notes: payload.notes ?? null,
    items,
  };
}

export async function submitOrderRequest(payload: OrderRequestPayload): Promise<Order> {
  // Always return a mock order immediately for instant confirmation.
  return buildMockOrder(payload);
}

export type { Product };

