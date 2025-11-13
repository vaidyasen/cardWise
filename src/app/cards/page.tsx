"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { CardForm } from "@/components/CardForm";
import { CardDetails } from "@/components/CardDetails";
import { fetchWithAuth } from "@/lib/useAuthToken";
import { Card as PrismaCard } from "@prisma/client";
import { CardFormData } from "@/types/card";

interface Card extends PrismaCard {
  offers: Array<{
    merchantCategory: string;
    percentage: number;
    conditions?: string;
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
    } catch (err) {
      setError("Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (cardData: CardFormData) => {
    try {
      const response = await fetchWithAuth("/api/cards", {
        method: "POST",
        body: JSON.stringify(cardData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add card");
      }

      const newCard = await response.json();
      setCards((prev) => [...prev, newCard]);
      setIsAddingCard(false);
      setError("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add card";
      setError(errorMessage);
    }
  };

  const handleEditCard = async (cardData: CardFormData) => {
    if (!editingCard) return;

    try {
      setError(""); // Clear any previous errors
      const response = await fetchWithAuth(`/api/cards/${editingCard.id}`, {
        method: "PUT",
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update card");
      }

      const updatedCard = await response.json();
      setCards((prev) =>
        prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
      );
      setEditingCard(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update card";
      setError(errorMessage);
      throw err; // Re-throw so CardForm can handle it
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading your cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">My Cards</h1>
            <p className="mt-2 text-gray-400">Manage your credit cards and offers</p>
          </div>
          {!isAddingCard && !editingCard && (
            <button
              onClick={() => setIsAddingCard(true)}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/50"
            >
              + Add New Card
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {isAddingCard && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Add New Card</h2>
              <button
                onClick={() => setIsAddingCard(false)}
                className="text-gray-400 transition-colors hover:text-white"
              >
                ✕ Cancel
              </button>
            </div>
            <CardForm onSubmit={handleAddCard} />
          </div>
        )}

        {editingCard && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Edit Card</h2>
              <button
                onClick={() => setEditingCard(null)}
                className="text-gray-400 transition-colors hover:text-white"
              >
                ✕ Cancel
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
            <div className="col-span-full rounded-2xl border border-dashed border-white/20 bg-white/5 p-12 text-center backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-lg text-gray-300">No cards added yet</p>
              <p className="mt-2 text-gray-500">
                Start tracking your rewards by adding your first card
              </p>
              <button
                onClick={() => setIsAddingCard(true)}
                className="mt-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-purple-500 hover:to-pink-500"
              >
                Add Your First Card
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
