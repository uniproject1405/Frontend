import { useMemo, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";

const COLORS = {
  navy: "#071739",
  blue: "#3E63A8",
  softBlue: "#EAF1FB",
  border: "#D8E3F0",
  textSoft: "#6E84A3",
  white: "#FFFFFF",
  bg: "#FBFCFE",
};

const people = [
  {
    id: "bahram",
    name: "بهرام",
    label: "بک",
    accent: "#D9B27A",
    x: 18,
    y: 30,
    size: 74,
  },
  {
    id: "niloufar",
    name: "نیلوفر",
    label: "نیلوفر",
    accent: "#6D8FCB",
    x: 50,
    y: 10,
    size: 64,
  },
  {
    id: "saman",
    name: "سامان",
    label: "سامان",
    accent: "#B8A1D9",
    x: 82,
    y: 30,
    size: 64,
  },
  {
    id: "maryam",
    name: "مریم",
    label: "مریم",
    accent: "#D98F86",
    x: 82,
    y: 70,
    size: 64,
  },
  {
    id: "arash",
    name: "آرش",
    label: "آرش",
    accent: "#82B7A5",
    x: 50,
    y: 90,
    size: 64,
  },
  {
    id: "shima",
    name: "شیما",
    label: "شیما",
    accent: "#D5A5C4",
    x: 18,
    y: 70,
    size: 74,
  },
];

const connections = [
  ["bahram", "saman"],
  ["bahram", "maryam"],
  ["bahram", "niloufar"],
  ["niloufar", "arash"],
  ["niloufar", "maryam"],
  ["shima", "arash"],
  ["shima", "saman"],
  ["saman", "maryam"],
  ["arash", "maryam"],
  ["niloufar", "shima"],
];

const notes = {
  bahram: {
    title: "بهرام کیانی",
    lines: [
      "سامان احمدی — فانتوم — داستان معمایی تعاملی",
      "مریم کاویانی — سیگنال — یادداشت‌های هفتگی مهندسی",
    ],
  },
  niloufar: {
    title: "نیلوفر شریفی",
    lines: [
      "آرش صادقی — تجربه‌نگار — مسیرهای واقعی همکاری",
      "سامان احمدی — موج آبی — محصولی برای تیم‌های کوچک",
    ],
  },
  saman: {
    title: "سامان احمدی",
    lines: [
      "بهرام کیانی — پالس — ایده‌ای برای ساخت مشترک",
      "شیما رضایی — ریشه — دفترچه‌ی رشد تیمی",
    ],
  },
  maryam: {
    title: "مریم کاویانی",
    lines: [
      "بهرام کیانی — سیگنال — یادداشت‌های هفتگی مهندسی",
      "نیلوفر شریفی — روشن — روایت‌های تصویری کوتاه",
    ],
  },
  arash: {
    title: "آرش صادقی",
    lines: [
      "شیما رضایی — قدم بعد — عادت‌های تیمی ساده",
      "نیلوفر شریفی — خانه‌ی ایده — جمع‌کردن ایده‌ها",
    ],
  },
  shima: {
    title: "شیما رضایی",
    lines: [
      "آرش صادقی — مسیر — همکاری‌های کوچک اما واقعی",
      "سامان احمدی — ریشه — ساخت از دل تجربه",
    ],
  },
};

export default function NetworkTrustSection() {
  const [activeId, setActiveId] = useState(null);

  const activeNote = notes[activeId || "bahram"];

  const peopleMap = useMemo(() => {
    return Object.fromEntries(people.map((p) => [p.id, p]));
  }, []);

  const isConnectedToActive = (a, b) => a === activeId || b === activeId;

  return (
    <Box
      component="section"
      sx={{
        mt: 0,
        width: "100%",
        maxWidth: "none",
        mx: 0,
        px: 0,
        pb: 0,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: "28px",
          bgcolor: COLORS.white,
          px: { xs: 2, sm: 3, md: 3.5 },
          py: { xs: 2, md: 2.5 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "320px minmax(0, 1fr)",
            },
            columnGap: { xs: 3, md: "120px", xl: "450px" },
            rowGap: { xs: 3, md: 4 },
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* graph - left */}
          <Box
            onMouseLeave={() => setActiveId(null)}
            sx={{
              order: { xs: 2, md: 1 },
              position: "relative",
              width: { xs: "min(100%, 290px)", sm: 310, md: 320 },
              aspectRatio: "1 / 1",
              height: "auto",
              minHeight: 0,
              maxWidth: "100%",
              mx: "auto",
              transform: "none",
              "&:hover": { cursor: "default" },
            }}
          >


            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
            >
              {connections.map(([a, b], index) => {
                const p1 = peopleMap[a];
                const p2 = peopleMap[b];
                const active = Boolean(activeId) && isConnectedToActive(a, b);

                return (
                  <line
                    key={`${a}-${b}-${index}`}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={active ? COLORS.blue : "#E2E9F3"}
                    strokeWidth={active ? 0.9 : 0.55}
                    opacity={active ? 1 : 0.75}
                    style={{
                      transition: "all 220ms ease",
                    }}
                  />
                );
              })}
            </svg>

            {people.map((person) => {
              const active = person.id === activeId;

              return (
                <Box
                  key={person.id}
                  onMouseEnter={() => setActiveId(person.id)}
                  sx={{
                    position: "absolute",
                    left: `${person.x}%`,
                    top: `${person.y}%`,
                    transform: `translate(-50%, -50%) ${active ? "translateY(-8px)" : "translateY(0)"}`,
                    transition: "transform 220ms ease",
                    textAlign: "center",
                    cursor: "pointer",
                    zIndex: active ? 3 : 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: active ? person.size * 0.84 : person.size * 0.80,
                      height: active ? person.size * 0.84 : person.size * 0.80,
                      mx: "auto",
                      bgcolor: active ? "#EAF1FB" : "#F7F9FC",
                      border: active
                        ? `2px solid ${COLORS.blue}`
                        : "1px solid #E4EAF3",
                      boxShadow: active
                        ? "0 12px 26px rgba(62, 99, 168, 0.18)"
                        : "0 6px 14px rgba(7, 23, 57, 0.06)",
                      transition: "all 220ms ease",
                    }}
                  >
                    <svg
                      viewBox="0 0 64 64"
                      width="76%"
                      height="76%"
                      aria-hidden="true"
                    >
                      <path
                        d="M13 39 25 17l13 12 13-9"
                        fill="none"
                        stroke={person.accent}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="25" cy="17" r="5.5" fill={COLORS.navy} />
                      <circle cx="38" cy="29" r="5" fill={COLORS.blue} />
                      <circle cx="51" cy="20" r="4.5" fill={person.accent} />
                      <path
                        d="M13 47c0-7 6-12 13-12h12c7 0 13 5 13 12v3H13z"
                        fill={COLORS.navy}
                        opacity=".92"
                      />
                      <path
                        d="M23 43h18"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity=".9"
                      />
                      <circle cx="49" cy="47" r="4" fill={person.accent} />
                    </svg>
                  </Avatar>

                  <Box
                    sx={{
                      mt: 1,
                      px: 1.4,
                      py: 0.5,
                      borderRadius: "999px",
                      bgcolor: COLORS.white,
                      border: `1px solid ${COLORS.border}`,
                      display: "inline-block",
                      minWidth: 44,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: active ? 800 : 600,
                        color: active ? COLORS.navy : COLORS.textSoft,
                        transition: "all 220ms ease",
                      }}
                    >
                      {person.label}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* content - right */}
          <Box
            dir="rtl"
            sx={{
              order: { xs: 1, md: 2 },
              direction: "rtl",
              textAlign: "right",
              unicodeBidi: "plaintext",
              width: "100%",
              minWidth: 0,
              "& .MuiTypography-root": {
                direction: "rtl",
                textAlign: "right",
                unicodeBidi: "plaintext",
                width: "100%",
              },
            }}
          >
            <Typography
              sx={{
                color: "#1E4C9A",
                fontSize: "13px",
                fontWeight: 800,
                mb: 1.2,
              }}
            >
              شبکه
            </Typography>

            <Typography
              component="h2"
              sx={{
                color: COLORS.navy,
                fontWeight: 900,
                lineHeight: 1.35,
                fontSize: { xs: "27px", sm: "32px", md: "40px" },
                mb: 1.5,
              }}
            >
              اینجا هیچ‌کس
              <br />
              غریبه نیست.
            </Typography>

            <Typography
              sx={{
                maxWidth: 560,
                color: COLORS.textSoft,
                fontSize: { xs: "15px", md: "16px" },
                lineHeight: 1.85,
                mb: 2.5,
              }}
            >
              هر خط یعنی پروژه‌ای که دو عضو با هم ساخته‌اند. نشانگر را روی هر چهره ببرید تا
              ببینید با چه کسانی کار کرده است، سپس از یکی از آن‌ها بخواهید شما را معرفی کند.
            </Typography>

            <Box
              dir="rtl"
              sx={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: "22px",
                bgcolor: "#FCFDFF",
                direction: "rtl",
                textAlign: "right",
                unicodeBidi: "plaintext",
                "& .MuiTypography-root": {
                  direction: "rtl",
                  textAlign: "right",
                  unicodeBidi: "plaintext",
                  width: "100%",
                },
                px: { xs: 2, md: 3 },
                py: { xs: 1.5, md: 1.8 },
              }}
            >
              <Typography
                sx={{
                  color: "#1E4C9A",
                  fontWeight: 800,
                  fontSize: { xs: "18px", md: "20px" },
                  mb: 1,
                }}
              >
                {activeNote.title}
              </Typography>

              {activeNote.lines.map((line) => (
                <Typography
                  key={line}
                  sx={{
                    color: COLORS.textSoft,
                    fontSize: { xs: "15px", md: "16px" },
                    lineHeight: 1.8,
                  }}
                >
                  {line}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}