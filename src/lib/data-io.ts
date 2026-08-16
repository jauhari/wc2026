import type { MemberInput, PickerMember } from "$lib/types";

/** Trigger unduhan file di browser dari konten string. */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Stempel tanggal untuk nama file, mis. "2026-08-16". */
export function fileDateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function toCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Ekspor daftar anggota jadi CSV (Nama, No. HP, Posisi) — bisa dibuka di Excel. */
export function membersToCsv(members: PickerMember[]): string {
  const header = ["Nama", "No. HP", "Posisi"];
  const rows = members.map((m) => [m.name, m.phone, m.position]);
  const csv = [header, ...rows].map((row) => row.map(toCsvField).join(",")).join("\r\n");
  // BOM supaya Excel membaca karakter non-ASCII (mis. é, ñ) dengan benar.
  return "\uFEFF" + csv;
}

/** Parser CSV minimal — menangani field berkutip ganda, koma & baris baru di dalam field. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const s = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // dilewati — \n yang mengakhiri baris
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

/** Ubah teks CSV (Nama, No. HP, Posisi) jadi daftar anggota — header opsional. */
export function csvToMemberInputs(text: string): MemberInput[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const firstCell = rows[0][0]?.trim().toLowerCase();
  const start = firstCell === "nama" || firstCell === "name" ? 1 : 0;

  const out: MemberInput[] = [];
  for (let i = start; i < rows.length; i++) {
    const [name, phone, position] = rows[i];
    if (!name?.trim()) continue;
    out.push({
      name: name.trim(),
      phone: phone?.trim() ?? "",
      position: position?.trim() ?? "",
    });
  }
  return out;
}
