"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { CardForm } from "@/components/CardForm";
import { CardDetails } from "@/components/CardDetails";
import { fetchWithAuth } from "@/lib/useAuthToken";

interface Card {
  id: string;
  name: string;
  bankName: string;
  cardNumber: string;
  offers: Array<{
    merchantCategory: string;
    percentage: number;
    conditions?: string | null;
  }>;
}

export default function CardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCards();
  }, [user]);

  const fetchCards = async () => {
    if (!user) return;

    try {
      const response = await fetchWithAuth("/api/cards");
      if (!response.ok) throw new Error("Failed to fetch cards");

      const data = await response.json();
      setCards(data);
    } catch (error) {
      setError("Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (cardData: any) => {
    try {
      const response = await fetchWithAuth("/api/cards", {
        method: "POST",
        body: JSON.stringify(cardData),
      });

      if (!response.ok) throw new Error("Failed to add card");

      const newCard = await response.json();
      setCards((prev) => [...prev, newCard]);
      setIsAddingCard(false);
    } catch (error) {
      setError("Failed to add card");
    }
  };

  const handleEditCard = async (cardData: any) => {
    if (!editingCard) return;

    try {
      const response = await fetchWithAuth(`/api/cards/${editingCard.id}`, {
        method: "PUT",
        body: JSON.stringify(cardData),
      });

      if (!response.ok) throw new Error("Failed to update card");

      const updatedCard = await response.json();
      setCards((prev) =>
        prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
      );
      setEditingCard(null);
    } catch (error) {
      setError("Failed to update card");
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const response = await fetchWithAuth(`/api/cards/${cardId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete card");

      setCards((prev) => prev.filter((card) => card.id !== cardId));
    } catch (error) {
      setError("Failed to delete card");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-2">Loading your cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Cards</h1>
        {!isAddingCard && !editingCard && (
          <button
            onClick={() => setIsAddingCard(true)}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
          >
            Add New Card
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-500 p-4 text-white">{error}</div>
      )}

      {isAddingCard && (
        <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Add New Card</h2>
            <button
              onClick={() => setIsAddingCard(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <CardForm onSubmit={handleAddCard} />
        </div>
      )}

      {editingCard && (
        <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Edit Card</h2>
            <button
              onClick={() => setEditingCard(null)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <CardForm initialData={editingCard} onSubmit={handleEditCard} />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <CardDetails
            key={card.id}
            card={card}
            onEdit={() => setEditingCard(card)}
            onDelete={() => handleDeleteCard(card.id)}
          />
        ))}

        {cards.length === 0 && !isAddingCard && (
          <div className="col-span-full text-center">
            <p className="text-gray-400">
              You haven&apos;t added any cards yet.
            </p>
            <button
              onClick={() => setIsAddingCard(true)}
              className="mt-4 text-purple-500 hover:text-purple-400"
            >
              Add your first card
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
