"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export function EditProductDialog({
  session,
  product,
  onProductUpdated,
}: {
  session: any;
  product: Product;
  onProductUpdated: (product: Product) => void;
}) {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [category, setCategory] = useState(product.category);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setLoading(true);
    setError(null);

    let imageUrl = product.image_url;
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
      .update({
        title,
        description,
        price: parseFloat(price),
        category,
        image_url: imageUrl,
      })
      .eq("id", product.id)
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      onProductUpdated(data);
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
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
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
