
const GlassBrandBar = ({topheight=20}) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div
      style={{top:topheight}}
        className="
          mx-auto
          max-w-4xl
          rounded-2xl
          px-6
          py-4
          relative
          flex
          items-center
          justify-between
          backdrop-blur-xl
          bg-blue-900/10
          border-b
          border-white/20
          shadow-lg
        "
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold">
            🍽️
          </div>
          <span className="text-xl text-white font-semibold tracking-tight">
            Dinely
          </span>
        </div>

        {/* Page Context (not navigation) */}
        <div className="text-sm text-white/70 hidden sm:block">
          making your restaurant faster!
        </div>
      </div>
    </div>
  );
};

export default GlassBrandBar;
