import localFont from "next/font/local";

const RobusFont = localFont({
  src: "@public/assets/fonts/robus.otf",
});

const DebugFont = localFont({
  src: "@public/assets/fonts/debug.otf",
});

export { DebugFont, RobusFont };
