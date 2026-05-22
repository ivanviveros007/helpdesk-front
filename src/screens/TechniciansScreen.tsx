"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { TechnicianTable } from "@/components/admin/TechnicianTable";
import { TechnicianForm } from "@/components/admin/TechnicianForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTechnicians, useCreateTechnician, useUpdateTechnician, useDeleteTechnician } from "@/hooks/useTechnicians";
import { useLevels } from "@/hooks/useLevels";
import type { Technician, CreateTechnicianPayload } from "@/types/technician";

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; technician: Technician };

export function TechniciansScreen() {
  const [modal, setModal] = useState<ModalState>({ type: "closed" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: technicians = [], isLoading } = useTechnicians();
  const { data: levels = [] } = useLevels();
  const { mutate: createTechnician, isPending: isCreating } = useCreateTechnician();
  const { mutate: updateTechnician, isPending: isUpdating } = useUpdateTechnician();
  const { mutate: deleteTechnician } = useDeleteTechnician();

  const closeModal = () => setModal({ type: "closed" });

  const handleSubmit = (payload: CreateTechnicianPayload) => {
    if (modal.type === "create") {
      createTechnician(payload, { onSuccess: closeModal });
    } else if (modal.type === "edit") {
      updateTechnician(
        { id: modal.technician.id, payload },
        { onSuccess: closeModal }
      );
    }
  };

  const handleDelete = (techId: string) => {
    setDeletingId(techId);
    deleteTechnician(techId, { onSettled: () => setDeletingId(null) });
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
        title="Técnicos"
        description="Gestioná los técnicos, sus niveles y sus skills. La IA los considera para asignar tickets."
        action={
          <Button onClick={() => setModal({ type: "create" })}>
            <Plus className="h-4 w-4" />
            Nuevo técnico
          </Button>
        }
      />

      {technicians.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin técnicos registrados"
          description="Agregá técnicos para que la IA pueda asignarles tickets."
          action={
            <Button onClick={() => setModal({ type: "create" })}>
              <Plus className="h-4 w-4" />
              Agregar técnico
            </Button>
          }
        />
      ) : (
        <TechnicianTable
          technicians={technicians}
          onEdit={(tech) => setModal({ type: "edit", technician: tech })}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      <Modal
        isOpen={modal.type !== "closed"}
        onClose={closeModal}
        title={modal.type === "edit" ? "Editar técnico" : "Nuevo técnico"}
        className="max-w-xl"
      >
        <TechnicianForm
          initialData={modal.type === "edit" ? modal.technician : undefined}
          levels={levels}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
          onCancel={closeModal}
        />
      </Modal>
    </>
  );
}
