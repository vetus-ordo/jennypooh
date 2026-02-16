'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { categoryData } from '@/lib/data'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableItem({ id, name, index }: { id: string; name: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-4 p-4 mb-3 bg-white border rounded-2xl cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? 'shadow-2xl border-emerald-500 opacity-50' : 'shadow-sm border-slate-100'
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
        {index + 1}
      </div>
      <span className="font-semibold text-slate-700">{name}</span>
    </div>
  );
}

export default function RankPage() {
  const { category } = useParams();
  const router = useRouter();
  const cat = categoryData[category as string];
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (cat) setItems(cat.items.map(i => i.id));
  }, [cat]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        const newList = arrayMove(prev, oldIndex, newIndex);
        
        // Save locally - in a real app, you'd push to Firebase here
        const existing = JSON.parse(localStorage.getItem(`rankings_${category}`) || '{}');
        localStorage.setItem(`rankings_${category}`, JSON.stringify({ ...existing, player1: newList }));
        
        return newList;
      });
    }
  };

  if (!cat) return <div className="p-20 text-center">Category not found.</div>;

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif font-bold text-slate-800 mb-2">{cat.name}</h1>
        <p className="text-slate-500 italic">{cat.instruction}</p>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id, index) => {
            const itemData = cat.items.find(i => i.id === id);
            return <SortableItem key={id} id={id} name={itemData?.name || ''} index={index} />;
          })}
        </SortableContext>
      </DndContext>

      <div className="mt-12 flex justify-between items-center">
        <Link href="/" className="text-slate-400 hover:text-slate-600 font-bold">← Back</Link>
        <button 
          onClick={() => router.push('/')}
          className="btn-blueprint"
        >
          Save Ranking
        </button>
      </div>
    </main>
  );
}
