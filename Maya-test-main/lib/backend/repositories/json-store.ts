import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const backendDataDir = path.join(process.cwd(), "data", "backend");

async function ensureBackendDataDir() {
  await mkdir(backendDataDir, { recursive: true });
}

export async function readJsonRecords<T>(fileName: string, fallback: T[] = []) {
  await ensureBackendDataDir();
  const filePath = path.join(backendDataDir, fileName);

  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    await writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

export async function writeJsonRecords<T>(fileName: string, records: T[]) {
  await ensureBackendDataDir();
  const filePath = path.join(backendDataDir, fileName);
  await writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}
