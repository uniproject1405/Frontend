import { Box, Typography } from "@mui/material";

const steps = [
  {
    number: "1",
    title: "پروژه را شروع کن",
    description:
      "چیزی را که می‌خواهی وجود داشته باشد توصیف کن؛ حتی اگر نصفه‌نیمه است، یک پاراگراف و یک طرح خام کافی است.",
  },
  {
    number: "2",
    title: "آدم‌هایت را پیدا کن",
    description:
      "ما همان دو سه نفری را نشانت می‌دهیم که جای خالی تیم را پر می‌کنند؛ نه پنجاه گزینه نامعلوم. تیم‌های کوچک بیشتر تمام می‌کنند.",
  },
  {
    number: "3",
    title: "با ساختن یاد بگیر",
    description:
      "یک ساعت از چیزی که خوب بلدی را با یک ساعت از چیزی که نمی‌دانی عوض کن؛ همراه با راهنماهایی از عضویابی که پیش از تو به همان دیوار خورده‌اند.",
  },
];

export default function HowTribeWorks() {
  return (
    <Box
      component="section"
      dir="rtl"
      aria-labelledby="how-tribe-works-title"
      sx={{
        width: "100%",
        my: 0,
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
        boxSizing: "border-box",
        borderRadius: { xs: 3, md: 4 },
        bgcolor: "#F7F8FA",
        textAlign: "right",
      }}
    >
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography
      
          sx={{
            color: "#1E4C9A",
            fontSize: 13,
            fontWeight: 800,
            mb: 1.2,
          }}
        >
          چطور کار می‌کند
        </Typography>

        <Typography
          id="how-tribe-works-title"
          component="h2"
          sx={{
            color: "#071739",
            fontSize: { xs: 25, sm: 32, md: 40 },
            fontWeight: 800,
            lineHeight: 1.55,
            mb: 1.5,
          }}
        >
          جایی برای ساختن، یاد گرفتن و با هم رشد کردن.
        </Typography>

        <Typography
          sx={{
            color: "#687B95",
            fontSize: { xs: 14, sm: 16 },
            lineHeight: 2,
            maxWidth: 850,
          }}
        >
          نه شمردن فالوور، نه نمایش تعامل. فقط تیم‌های کوچک، یک تقویم مشترک و
          کاری که از ساختمان بیرون می‌رود.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
          gap: { xs: 2, md: 3 },
        }}
      >
        {steps.map((step) => (
          <Box
            key={step.number}
            sx={{
              minWidth: 0,
              minHeight: { xs: 220, md: 250 },
              p: { xs: 2.5, md: 3.5 },
              border: "1px solid #E5D8C9",
              borderRadius: 3,
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "right",
              transition:
                "border-color .2s ease, box-shadow .2s ease, transform .2s ease",
              "&:hover": {
                borderColor: "#C9A47F",
                boxShadow: "0 12px 28px rgba(7,23,57,0.07)",
                transform: "translateY(-3px)",
              },
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "#071739",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 800,
                mb: 2.5,
                flexShrink: 0,
                boxShadow: "0 5px 14px rgba(7,23,57,0.08)",
              }}
            >
              {step.number}
            </Box>

            <Typography
              component="h3"
              sx={{
                color: "#071739",
                fontSize: { xs: 18, md: 20 },
                fontWeight: 800,
                lineHeight: 1.7,
                mb: 1.2,
              }}
            >
              {step.title}
            </Typography>

            <Typography
              sx={{
                color: "#687B95",
                fontSize: { xs: 14, md: 15 },
                lineHeight: 1.95,
              }}
            >
              {step.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
