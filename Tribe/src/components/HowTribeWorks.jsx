import { Box, Typography } from "@mui/material";

const steps = [
  {
    number: "۱",
    title: "پروژه را شروع کنید",
    description:
      "ایده‌ای را که در ذهن دارید توصیف کنید؛ حتی اگر هنوز کامل نیست، یک پاراگراف و یک طرح اولیه کافی است.",
  },
  {
    number: "۲",
    title: "هم‌تیمی‌هایتان را پیدا کنید",
    description:
      "به‌جای ده‌ها گزینه‌ی نامشخص، چند نفری را می‌بینید که دقیقاً جای خالی تیم را پر می‌کنند. تیم‌های کوچک کارها را بهتر به نتیجه می‌رسانند.",
  },
  {
    number: "۳",
    title: "با ساختن یاد بگیرید",
    description:
      "مهارتی را که خوب بلدید با مهارتی که می‌خواهید یاد بگیرید مبادله کنید؛ همراه با راهنمایی کسانی که پیش از شما همین مسیر را رفته‌اند.",
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
          بدون شمارش دنبال‌کننده و نمایش لایک؛ فقط تیم‌های کوچک، یک برنامه‌ی مشترک و
          کاری که واقعاً به نتیجه می‌رسد.
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
