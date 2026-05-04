import type { Doctor } from "@/features/doctors/types";
import { doctorsMock } from "@/features/doctors/mock";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDoctors(): Promise<Doctor[]> {
  await delay(200);
  return [...doctorsMock];
}

export async function getDoctor(id: string): Promise<Doctor | null> {
  await delay(150);
  return doctorsMock.find((doctor) => doctor.id === id) ?? null;
}
