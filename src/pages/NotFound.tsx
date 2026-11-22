import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-slate-500">Alamat yang kamu buka tidak ada di ML Academy.</p>
      <Link to="/" className="btn-primary mt-6">Kembali ke Dashboard</Link>
    </div>
  );
}
