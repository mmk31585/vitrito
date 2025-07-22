"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  const { isAdmin, protectRoute } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    protectRoute();

    if (isAdmin) {
      const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("categories").select("*");

        if (error) {
          setError(error.message);
        } else {
          setCategories(data);
        }
        setLoading(false);
      };
      fetchCategories();
    }
  }, [isAdmin, protectRoute]);

  const handleDelete = async (categoryId: string) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      setError(error.message);
    } else {
      setCategories(categories.filter((c) => c.id !== categoryId));
    }
  };

  if (!isAdmin) {
    return <div>You are not authorized to view this page.</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Category Management</h1>
        <AddCategoryDialog
          onCategoryAdded={(newCategory) =>
            setCategories([...categories, newCategory])
          }
        />
      </div>
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AddCategoryDialog({
  onCategoryAdded,
}: {
  onCategoryAdded: (category: Category) => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("categories")
      .insert({ name })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      onCategoryAdded(data);
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
