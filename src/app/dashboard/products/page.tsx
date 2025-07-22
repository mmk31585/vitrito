"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditProductDialog } from "@/components/EditProductDialog";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export default function ProductsPage() {
  const { session, protectRoute } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    protectRoute();

    if (session) {
      const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("showcase_items")
          .select("*")
          .eq("profile_id", session.user.id);

        if (error) {
          setError(error.message);
        } else {
          setProducts(data);
        }
        setLoading(false);
      };
      fetchProducts();
    }
  }, [session, protectRoute]);

  const handleDelete = async (productId: string) => {
    const { error } = await supabase
      .from("showcase_items")
      .delete()
      .eq("id", productId);

    if (error) {
      setError(error.message);
    } else {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Products</h1>
        <AddProductDialog session={session} onProductAdded={(newProduct) => setProducts([...products, newProduct])} />
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={product.image_url} alt={product.title} className="rounded-md" />
              <p className="mt-4">{product.description}</p>
              <p className="mt-2 font-bold">${product.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{product.category}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <EditProductDialog session={session} product={product} onProductUpdated={(updatedProduct) => {
                setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
              }} />
              <Button variant="destructive" onClick={() => handleDelete(product.id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddProductDialog({ session, onProductAdded }: { session: any, onProductAdded: (product: Product) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setLoading(true);
    setError(null);

    let imageUrl = "";
    if (image) {
      const { data, error } = await supabase.storage
        .from("showcase-images")
        .upload(`${session.user.id}/${image.name}`, image, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("showcase-images")
        .getPublicUrl(data.path);
      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("showcase_items")
      .insert({
        profile_id: session.user.id,
        title,
        description,
        price: parseFloat(price),
        category,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      onProductAdded(data);
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
