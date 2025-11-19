"use client";

import { useState, useEffect } from "react";
import Header from "@/shared/ui/components/Header/Header";
import Main from "@/shared/ui/components/Main/Main";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import {
  CustomTypeInfo,
  CreateCustomTypeRequest,
  CustomTypesListResponse,
} from "./types";
import CustomTypeList from "./ui/CustomTypeList";
import CreateEnumModal from "./ui/modals/CreateEnumModal";
import CreateCompositeModal from "./ui/modals/CreateCompositeModal";
import s from "./page.module.sass";
import clsx from "clsx";

type ModalType = "enum" | "composite" | null;

export default function CustomTypesPage() {
  const [types, setTypes] = useState<CustomTypeInfo[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Загрузка типов при открытии страницы
  useEffect(() => {
    fetchCustomTypes();
  }, []);

  const fetchCustomTypes = async () => {
    try {
      setIsLoading(true);
      await loadCustomTypes();
    } catch (err: any) {
      setError("Ошибка загрузки типов");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomTypes = async () => {
    try {
      const result = await (window as any).go.main.App.GetCustomTypes();
      const parsed = JSON.parse(result) as CustomTypesListResponse;
      if (parsed.error) {
        setError(parsed.error);
        return;
      }
      setTypes(parsed.types);
      setError("");
    } catch (err: any) {
      setError(err.message || "Ошибка при загрузке типов");
      console.error(err);
    }
  };

  const handleCreateType = async (data: CreateCustomTypeRequest) => {
    try {
      setIsLoading(true);
      const result = await (window as any).go.main.App.CreateCustomType(data);
      const parsed = JSON.parse(result);

      if (parsed.error) {
        throw new Error(parsed.error);
      }

      if (parsed.success) {
        setActiveModal(null);
        await loadCustomTypes();
      }
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteType = async (typeName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить тип "${typeName}"?`)) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await (window as any).go.main.App.DropCustomType({
        typeName,
      });
      const parsed = JSON.parse(result);

      if (parsed.error) {
        throw new Error(parsed.error);
      }

      if (parsed.success) {
        await loadCustomTypes();
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при удалении типа");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentWrapper>
      <Header />
      <Main>
        <section className={clsx("section", s["custom-types-section"])}>
          <h1 className={s["page-title"]}>
            Управление пользовательскими типами
          </h1>

          <div className={s["controls"]}>
            <button
              className={clsx(s["btn"], s["btn-enum"])}
              onClick={() => setActiveModal("enum")}
              disabled={isLoading}
            >
              + Создать ENUM
            </button>
            <button
              className={clsx(s["btn"], s["btn-composite"])}
              onClick={() => setActiveModal("composite")}
              disabled={isLoading}
            >
              + Создать составной тип
            </button>
          </div>

          {error && <div className={s["error-message"]}>{error}</div>}

          <CustomTypeList
            types={types}
            onEdit={() => {}} // Пока не реализовано редактирование
            onDelete={handleDeleteType}
            isLoading={isLoading}
          />
        </section>

        {activeModal === "enum" && (
          <CreateEnumModal
            onClose={() => setActiveModal(null)}
            onSubmit={handleCreateType}
            isLoading={isLoading}
          />
        )}

        {activeModal === "composite" && (
          <CreateCompositeModal
            onClose={() => setActiveModal(null)}
            onSubmit={handleCreateType}
            isLoading={isLoading}
          />
        )}
      </Main>
    </ContentWrapper>
  );
}
