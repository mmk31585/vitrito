"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type ShowcaseItem = {
  id: string;
  title: string;
  category: string;
  price?: number;
  is_active: boolean;
};

export default function AdminShowcaseItemsPage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("showcase_items")
        .select("id, title, category, price, is_active");

      if (error) {
        setError(error.message);
      } else {
        setItems(data);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Showcase Items</h1>
      <table className="mt-8 w-full">
        <thead>
          <tr>
            <th className="text-left">ID</th>
            <th className="text-left">Title</th>
            <th className="text-left">Category</th>
            <th className="text-left">Price</th>
            <th className="text-left">Is Active</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.is_active ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
