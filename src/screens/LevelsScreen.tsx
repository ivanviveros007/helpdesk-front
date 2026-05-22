"use client";

import { useState } from "react";
import { Plus, Layers } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { LevelTable } from "@/components/admin/LevelTable";
import { LevelForm } from "@/components/admin/LevelForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLevels, useCreateLevel, useUpdateLevel, useDeleteLevel } from "@/hooks/useLevels";
import type { Level, CreateLevelPayload } from "@/types/level";

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; level: Level };

export function LevelsScreen() {
  const [modal, setModal] = useState<ModalState>({ type: "closed" });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: levels = [], isLoading } = useLevels();
  const { mutate: createLevel, isPending: isCreating } = useCreateLevel();
  const { mutate: updateLevel, isPending: isUpdating } = useUpdateLevel();
  const { mutate: deleteLevel } = useDeleteLevel();

  const closeModal = () => setModal({ type: "closed" });

  const handleSubmit = (payload: CreateLevelPayload) => {
    if (modal.type === "create") {
      createLevel(payload, { onSuccess: closeModal });
    } else if (modal.type === "edit") {
      updateLevel({ id: modal.level.id, payload }, { onSuccess: closeModal });
    }
  };

  const handleDelete = (levelId: number) => {
    setDeletingId(levelId);
    deleteLevel(levelId, { onSettled: () => setDeletingId(null) });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Header
        title="Niveles de soporte"
        description="Configurá los niveles y sus rangos de responsabilidad. La IA los usa para asignar tickets."
        action={
          <Button onClick={() => setModal({ type: "create" })}>
            <Plus className="h-4 w-4" />
            Nuevo nivel
          </Button>
        }
      />

      {levels.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Sin niveles configurados"
          description="Creá el primer nivel de soporte para que la IA pueda asignar tickets."
          action={
            <Button onClick={() => setModal({ type: "create" })}>
              <Plus className="h-4 w-4" />
              Crear nivel
            </Button>
          }
        />
      ) : (
        <LevelTable
          levels={levels}
          onEdit={(level) => setModal({ type: "edit", level })}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      <Modal
        isOpen={modal.type !== "closed"}
        onClose={closeModal}
        title={modal.type === "edit" ? "Editar nivel" : "Nuevo nivel"}
      >
        <LevelForm
          initialData={modal.type === "edit" ? modal.level : undefined}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
          onCancel={closeModal}
        />
      </Modal>
    </>
  );
}
