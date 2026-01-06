import Link from 'next/link';

export default function Footer() {
  const now = new Date();
  const year = now.getFullYear();
  return (
    <div className="grid grid-cols-2 gap-5 py-15 text-[#b3c0d3]">
      <div className="flex gap-2 text-sm font-bold text-center justify-center md:justify-start">
        <p>CSSTATLAB &copy; {year}</p>
      </div>
      <div className="flex justify-center md:justify-end gap-5 text-sm">
        <Link className="hover:underline" href="../privacy/">
          Privacy
        </Link>
        <Link className="hover:underline" href="../tos/">
          Terms
        </Link>
      </div>
    </div>
  );
}
