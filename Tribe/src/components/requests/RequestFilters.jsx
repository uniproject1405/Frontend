import { Box, Button, InputBase } from "@mui/material";
import { FILTERS } from "../../utils/requestStatus";

export default function RequestFilters({ filter, onFilterChange, query, onQueryChange, onSearch }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 1.2, md: 1.2 },
        alignItems: { xs: "stretch", md: "center" },
        mb: { xs: 2, md: 2.6 },
      }}
    >
      {/* جست‌وجو — اول در DOM → سمت راست */}
      <Box
        component="form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        sx={{
          width: { xs: "100%", md: "36%" },
          minWidth: { md: 260 },
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 0.8,
          bgcolor: "#fff",
          border: "1px solid #D9E0E7",
          borderRadius: "5px",
          p: "3px",
          boxSizing: "border-box",
          "&:focus-within": { borderColor: "#AEBBC9" },
        }}
      >
        <InputBase
          fullWidth
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="جست‌وجو در نام پروژه‌ها"
          slotProps={{ input: { "aria-label": "جست‌وجو در نام پروژه‌ها" } }}
          sx={{ px: 1.4, fontSize: { xs: 12, md: 12.5 }, height: { xs: 32, md: 34 } }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            flexShrink: 0,
            px: 2.1,
            py: 0.4,
            minWidth: 72,
            borderRadius: "4px",
            bgcolor: "#071739",
            fontSize: { xs: 12, md: 12.5 },
            boxShadow: "none",
            "&:hover": { bgcolor: "#142B52", boxShadow: "none" },
          }}
        >
          جست‌وجو
        </Button>
      </Box>

      {/* فیلتر وضعیت — بعد از جست‌وجو؛ «همه» اولین و راست‌ترین، بقیه به سمت چپ */}
      <Box
        role="group"
        aria-label="فیلتر بر اساس وضعیت"
        sx={{ display: "flex", gap: 0.7, flexWrap: "wrap" }}
      >
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          return (
            <Button
              key={value}
              type="button"
              size="small"
              aria-pressed={active}
              onClick={() => onFilterChange(value)}
              sx={{
                minWidth: 0,
                minHeight: { xs: 38, md: 40 },
                flex: { xs: "1 1 auto", md: "0 0 auto" },
                px: 2.2,
                py: 0.45,
                borderRadius: "5px",
                fontSize: { xs: 12, md: 12.5 },
                fontWeight: 600,
                ...(active
                  ? { bgcolor: "#071739", color: "#fff", "&:hover": { bgcolor: "#071739" } }
                  : {
                      border: "1px solid #D9E0E7",
                      color: "#334761",
                      bgcolor: "#fff",
                      "&:hover": { bgcolor: "#F8FAFC", borderColor: "#B9C5D1" },
                    }),
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
