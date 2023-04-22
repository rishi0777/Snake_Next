import localFont from "next/font/local";

const RobusFont = localFont({
  src: "../public/fonts/robus.otf",
});

const DebugFont = localFont({
  src: "../public/fonts/debug.otf",
});

const PacFont = localFont({ src: "../public/fonts/pac.ttf" });

const HaloFont = localFont({ src: "../public/fonts/halo.ttf" });

const IomanoidFont = localFont({ src: "../public/fonts/iomanoid.ttf" });

export { DebugFont, RobusFont, PacFont, HaloFont, IomanoidFont };
