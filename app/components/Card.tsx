export default function Card({ label, value, icon: Icon, desc }: any) {
  return (
    <div className="bg-zinc-900/50 group border border-[#383838] hover:border-[#666] transition-border duration-200 rounded p-5 flex flex-col items-center md:items-start gap-3">
      <div className="bg-[#07a4f1]/15 group-hover:bg-emerald-400/15 p-2 rounded-md w-fit">
        <Icon className="h-5 w-5 text-[#07a4f1] group-hover:text-emerald-400 transition-all duration-200" />
      </div>
      <p className="text-[#b3c0d3] text-xs font-bold">{label}</p>
      <h1 className="text-[#eae8e0] font-bold text-2xl">{value}</h1>
    </div>
  );
}
